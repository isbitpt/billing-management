import * as path from 'path';
import * as fs from 'fs';

import {Constants} from '../constants';
import {UserDatabasesRepository} from './repositories';
import {UserDatabaseEntity} from './entities/user-database.entity';
import {DataSource} from 'typeorm';

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

    DatabaseManager.#context = {
      ...DatabaseManager.#context,
      appContext: {
        databasesRepository: new UserDatabasesRepository(this.#appDb.getRepository(UserDatabaseEntity))
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
      entities: [ UserDatabaseEntity ],
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
