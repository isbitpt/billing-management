import * as path from 'path';
import * as fs from 'fs';

import {Constants} from '../constants';
import {UserDatabaseEntity} from '../database/entities/user-database.entity';
import {DataSource} from 'typeorm';

export class Symbols {
  public static readonly applicationDatabaseSymbol = Symbol.for('ApplicationDatabaseSymbol');
  public static readonly financeManagementDatabaseSymbol = Symbol.for('FinanceManagementDatabaseSymbol');
}

export class DatabaseManager {
  static #instance: DatabaseManager;

  #applicationDatabaseSymbol: DataSource;
  #financeManagementDatabaseSymbol: DataSource;

  private constructor() {}

  public static async initDB(): Promise<void> {
    this.#instance = new DatabaseManager();
    await this.#instance.loadAppDatabaseAsync();
  }

  public static getDatabaseInstance(symbol: Symbols): DataSource {
    switch (symbol) {
      case Symbols.applicationDatabaseSymbol:
        return this.#instance.#applicationDatabaseSymbol;
      case Symbols.financeManagementDatabaseSymbol:
        return this.#instance.#financeManagementDatabaseSymbol;
    }
  }

  private async loadAppDatabaseAsync(): Promise<void> {
    const file = path.join(Constants.AppRoot, 'db.sqlite');
    const existsDb = fs.existsSync(file);

    this.#applicationDatabaseSymbol = new DataSource({
      database: file,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ UserDatabaseEntity ],
      verbose: console.log
    });

    await this.#applicationDatabaseSymbol.initialize();

    if (!existsDb) {
      await this.#applicationDatabaseSymbol.synchronize();
    }
  }

  private async loadUserDatabaseAsync(bdId: string, dbKey: string): Promise<void> {
    /*const authedBd = await this.#context.appContext.databasesRepository.auth(bdId, dbKey);

    if (authedBd == null) {
      throw new Error('Cannot login into this database.');
    }

    const fileName = authedBd.id.replace('-','');
    const file = `user_${fileName}.sqlite`;
    const existsDb = fs.existsSync(file);

    this.#financeManagementDatabaseSymbol = new DataSource({
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

    await this.#financeManagementDatabaseSymbol.initialize();

    if (!existsDb) {
      await this.#financeManagementDatabaseSymbol.synchronize();
    }*/
  }
}
