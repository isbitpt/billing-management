import * as path from 'path';
import * as fs from 'fs';

import {Constants} from '../constants';
import {UserDatabaseEntity} from '../database/entities/user-database.entity';
import {DataSource} from 'typeorm';
import {Container} from 'inversify';

export class Symbols {
  public static readonly appDB = Symbol.for('AppDB');
  public static readonly userDb = Symbol.for('UserDb');
}

export class DatabaseManager {
  static #appDb: DataSource;
  static #userDB: DataSource;

  public static async initDB(container: Container): Promise<void> {
    await DatabaseManager.loadAppDatabaseAsync();

    container.bind<DataSource>(Symbols.appDB).toDynamicValue(() => DatabaseManager.#appDb).inRequestScope();
    container.bind<DataSource>(Symbols.userDb).toDynamicValue(() => DatabaseManager.#userDB).inRequestScope();
  }

  private static async loadAppDatabaseAsync(): Promise<void> {
    const file = path.join(Constants.AppRoot, 'db.sqlite');
    const existsDb = fs.existsSync(file);

    this.#appDb = new DataSource({
      database: file,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ UserDatabaseEntity ],
      verbose: console.log
    });

    await this.#appDb.initialize();

    if (!existsDb) {
      await this.#appDb.synchronize();
    }
  }

  private static async loadUserDatabaseAsync(bdId: string, dbKey: string): Promise<void> {
    /*const authedBd = await this.#context.appContext.databasesRepository.auth(bdId, dbKey);

    if (authedBd == null) {
      throw new Error('Cannot login into this database.');
    }

    const fileName = authedBd.id.replace('-','');
    const file = `user_${fileName}.sqlite`;
    const existsDb = fs.existsSync(file);

    this.#userDB = new DataSource({
      database: file,
      type: 'better-sqlite3',
      key: dbKey,
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ UserDatabaseEntity ],
      prepareDatabase: db => {
        db.pragma('cipher=\'sqlcipher\'');
      },
      verbose: console.log
    });

    await this.#userDB.initialize();

    if (!existsDb) {
      await this.#userDB.synchronize();
    }*/
  }
}
