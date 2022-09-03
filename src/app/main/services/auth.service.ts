import {UserDatabase} from './models/user-database';
import {DatabaseManager} from '../database';

export class AuthService {
  public static async loadDatabases(): Promise<UserDatabase[]> {
    const loadedDatabases = await DatabaseManager
      .appDatabaseContext
      .databasesRepository
      .getAllDatabases();

    return loadedDatabases;
  }

  public static async loginToBd(bdId: string, pkey: string): Promise<UserDatabase | null> {
    const loggedBd = await DatabaseManager
      .appDatabaseContext
      .databasesRepository
      .auth(bdId, pkey);

    return loggedBd;
  }
}
