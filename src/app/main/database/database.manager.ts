import * as path from 'path';
import * as fs from 'fs';

import {Constants} from '../constants';
import {AppConfigurationEntity, AppDatabaseEntity, PrivateDatabaseEntity, PublicDatabaseEntity} from './entities';
import {DataSource} from 'typeorm';
import {DatabaseSymbols} from './database-symbols';
import * as crypto from 'crypto';

export class DatabaseManager {
  static #instance: DatabaseManager;

  #applicationDatabase: DataSource;
  #managementDatabase: DataSource;

  private constructor() {}

  public static async initDB(): Promise<void> {
    this.#instance = new DatabaseManager();
    await this.#instance.loadAppDatabaseAsync();
  }

  public static getDatabaseInstance(symbol: DatabaseSymbols): DataSource {
    switch (symbol) {
      case DatabaseSymbols.applicationDatabaseSymbol:
        return this.#instance.#applicationDatabase;
      case DatabaseSymbols.managementDatabaseSymbol:
        return this.#instance.#managementDatabase;
    }
  }

  public static async loadUserDatabaseAsync(location: string): Promise<DataSource> {
    const file = path.join(location);
    const existsDb = fs.existsSync(file);

    this.#instance.#managementDatabase = new DataSource({
      database: location,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ PublicDatabaseEntity, PrivateDatabaseEntity ],
    });

    await this.#instance.#managementDatabase.initialize();

    if (!existsDb) {
      await this.#instance.#managementDatabase.synchronize();
    }

    return this.#instance.#managementDatabase;
  }

  public static async createDatabase(location: string, bdId: string, name: string, pKey: string): Promise<void> {
    const newDatabase = new DataSource({
      database: location,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ PublicDatabaseEntity, PrivateDatabaseEntity ],
      verbose: console.log
    });

    await newDatabase.initialize();

    await newDatabase.synchronize();

    const newDatabasePublicRepository = newDatabase.getRepository(PublicDatabaseEntity);

    const newKey = crypto.createHmac('sha1', pKey).digest('hex');

    const publicDatabase = newDatabasePublicRepository.create({
      id: bdId,
      name,
      privateKey: newKey
    });
    await newDatabasePublicRepository.save(publicDatabase);

    const newDatabasePrivateRepository = newDatabase.getRepository(PrivateDatabaseEntity);

    const privateDatabase = newDatabasePrivateRepository.create({
      id: bdId,
      data: '',
      date: new Date()
    });
    await newDatabasePrivateRepository.save(privateDatabase);

    await newDatabase.destroy();
  }

  public static async importDatabase(location: string, privateKey: string): Promise<AppDatabaseEntity | null> {

    return await this.loadDatabaseTemp(location, privateKey, async (database) => {
      const existingDatabasePublicRepository = database.getRepository(PublicDatabaseEntity);

      const publicInfos = await existingDatabasePublicRepository.find();

      if (publicInfos == null || publicInfos.length === 0) {
        return null;
      }

      const publicInfo = publicInfos[0];

      if (publicInfo == null) {
        return null;
      }

      const appRepository = this.#instance.#applicationDatabase
        .getRepository(AppDatabaseEntity);

      const importedDatabase = appRepository.create({
        id: publicInfo.id,
        name: publicInfo.name,
        location
      });

      await appRepository.save(importedDatabase);

      return importedDatabase;
    });
  }

  public static async loadDatabaseTemp<T>(location: string, privateKey: string, action: (database: DataSource) => T): Promise<T> {
    const existingDatabase = new DataSource({
      database: location,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ PublicDatabaseEntity, PrivateDatabaseEntity ],
      verbose: console.log
    });

    await existingDatabase.initialize();

    await existingDatabase.synchronize();

    const existingKey = crypto.createHmac('sha1', privateKey).digest('hex');

    const existingDatabasePublicRepository = existingDatabase.getRepository(PublicDatabaseEntity);

    const publicInfos = await existingDatabasePublicRepository.find();

    if (publicInfos == null || publicInfos.length === 0) {
      await existingDatabase.destroy();
      return;
    }

    const publicInfo = publicInfos[0];

    if (publicInfo == null || publicInfo.privateKey !== existingKey) {
      await existingDatabase.destroy();
      return;
    }

    const result = await action(existingDatabase);

    await existingDatabase.destroy();

    return result;
  }

  public static async close(): Promise<void> {
    if (!!this.#instance.#applicationDatabase) {
      await this.#instance.#applicationDatabase.destroy();
    }

    if (!!this.#instance.#managementDatabase) {
      await this.#instance.#managementDatabase.destroy();
    }
  }

  private async loadAppDatabaseAsync(): Promise<void> {
    const file = path.join(Constants.AppRoot, 'db.sqlite');
    const existsDb = fs.existsSync(file);

    this.#applicationDatabase = new DataSource({
      database: file,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ AppDatabaseEntity, AppConfigurationEntity ],
    });

    await this.#applicationDatabase.initialize();

    if (!existsDb) {
      await this.#applicationDatabase.synchronize();
    }
  }
}
