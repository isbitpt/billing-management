import * as path from 'path';
import * as fs from 'fs';

import {Constants} from '../Constants';
import {UserDatabasesRepository} from './repositories';
import {UserDatabase} from './entities/UserDatabase';
import {DataSource} from 'typeorm';
import * as uuid from 'uuid';

export class DatabaseManager {
  static #context: DatabaseContext | null = null;
  static #appDb: DataSource;
  static #userDB: DataSource;

  public static get isUserDbLoaded(): boolean {
    return DatabaseManager.#context != null && DatabaseManager.#context.userContext != null;
  }

  public static get isAppDbLoaded(): boolean {
    return DatabaseManager.#context != null && DatabaseManager.#context.appContext != null;
  }

  public static get appDatabaseContext(): AppDatabaseContext {
    if (!DatabaseManager.isAppDbLoaded)
    {throw new Error('Database is not ready');}

    return DatabaseManager.#context.appContext;
  }

  public static get userDatabaseContext(): UserDatabaseContext {
    if (!DatabaseManager.isUserDbLoaded)
    {throw new Error('User database not loaded');}

    return DatabaseManager.#context.userContext;
  }

  public static async loadAppDatabaseAsync(): Promise<void> {
    if (!process.env.APP_DB_KEY)
      {throw new Error('Missing env key \'APP_DB_KEY\', should be a anything alphanumeric');}

    const file = path.join(Constants.AppRoot, 'db.enc');
    const existsDb = fs.existsSync(file);

    this.#appDb = new DataSource({
      database: file,
      type: 'better-sqlite3',
      key: process.env.APP_DB_KEY,
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ UserDatabase ],
      prepareDatabase: db => {
        db.pragma(`rekey = ${process.env.APP_DB_KEY}`);
        db.pragma('cipher = \'sqlcipher\'');
      },
      verbose: console.log
    });

    await this.#appDb.initialize();

    if (!existsDb) {
      await this.#appDb.synchronize();
    }

    DatabaseManager.#context = {
      ...DatabaseManager.#context,
      appContext: {
        databasesRepository: new UserDatabasesRepository(this.#appDb.getRepository(UserDatabase))
      }
    };
  }

  public static async loadUserDatabaseAsync(bdId: string, dbKey: string): Promise<void> {
    const authedBd = await this.#context.appContext.databasesRepository.auth(bdId, dbKey);

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
      entities: [ UserDatabase ],
      prepareDatabase: db => {
        db.pragma('cipher=\'sqlcipher\'');
      },
      verbose: console.log
    });

    await this.#userDB.initialize();

    if (!existsDb) {
      await this.#userDB.synchronize();
    }

    DatabaseManager.#context = {
      ...DatabaseManager.#context,
      userContext: {

      }
    };
  }

  public static async closeAndSave(): Promise<void> {
    await this.#appDb.destroy();
  }
}

interface DatabaseContext {
  appContext: AppDatabaseContext;
  userContext: UserDatabaseContext;
}

interface AppDatabaseContext {
  databasesRepository: UserDatabasesRepository;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserDatabaseContext {

}
