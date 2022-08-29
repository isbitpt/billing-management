import * as path from 'path'
import * as fs from 'fs';

import {Constants} from '../Constants';
import {UserDatabasesRepository} from './repositories';
import {UserDatabase} from './entities/UserDatabase';
import {DataSource} from 'typeorm';

export class DatabaseManager {
  static #context: DatabaseContext | null = null;
  static #appDb: DataSource;
  static #userDB: DataSource;

  public static async LoadAppDatabaseAsync(): Promise<void> {
    const file = path.join(Constants.AppRoot, 'db.enc')

    const existsDb = fs.existsSync(file);

    this.#appDb = new DataSource({
      database: file,
      type: 'better-sqlite3',
      key: '123',
      driver: require('better-sqlite3-multiple-ciphers'),
      entities: [ UserDatabase ],
      prepareDatabase: db => {
        db.pragma(`cipher='sqlcipher'`)
      }
    })

    await this.#appDb.initialize();

    if (!existsDb) {
      await this.#appDb.synchronize();
    }

    DatabaseManager.#context = {
      ...DatabaseManager.#context,
      appContext: {
        databasesRepository: new UserDatabasesRepository(this.#appDb.getRepository(UserDatabase))
      }
    }
  }

  public static async LoadUserDatabaseAsync(bdName: string, dbKey: string): Promise<void> {
    const file = `user_${bdName}.sqlite`;

    const existsDb = fs.existsSync(file);

    this.#userDB = new DataSource({
      database: file,
      type: "better-sqlite3"
    })


    if (!!this.#userDB && existsDb) {
      throw new Error("Error loading user database");
    }

    DatabaseManager.#context = {
      ...DatabaseManager.#context,
      userContext: {

      }
    }
  }

  public static async CloseAndSave(): Promise<void> {
    await this.#appDb.destroy()
  }

  public static get isUserDbLoaded(): boolean {
    return DatabaseManager.#context != null && DatabaseManager.#context.userContext != null;
  }

  public static get isAppDbLoaded(): boolean {
    return DatabaseManager.#context != null && DatabaseManager.#context.appContext != null;
  }

  public static get appDatabaseContext(): AppDatabaseContext {
    if (!DatabaseManager.isAppDbLoaded)
      throw new Error("Database is not ready");

    return DatabaseManager.#context.appContext;
  }

  public static get userDatabaseContext(): UserDatabaseContext {
    if (!DatabaseManager.isUserDbLoaded)
      throw new Error("User database not loaded");

    return DatabaseManager.#context.userContext;
  }
}

interface AppDatabaseStruct {
  userDatabases: UserDatabase[]
}

interface DatabaseContext {
  appContext: AppDatabaseContext;
  userContext: UserDatabaseContext;
}

interface AppDatabaseContext {
  databasesRepository: UserDatabasesRepository
}

interface UserDatabaseContext {
}
