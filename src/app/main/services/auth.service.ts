import * as crypto from 'crypto';
import * as fs from 'fs';
import {provide} from 'inversify-binding-decorators';
import {inject} from 'inversify';

import {UserDatabase} from './models/user-database';
import {
  PublicDatabaseEntity,
  UserDatabasesRepository,
  AppDatabaseRepository,
  AppConfigurationRepository
} from '@isbit/main/database';
import {DatabaseManager} from '../database/database.manager';

import {AppConfigurationDomains} from '../constants';

@provide(AuthService)
export class AuthService {
  @inject(AppConfigurationRepository)  private appConfigurationRepository: AppConfigurationRepository;
  @inject(AppDatabaseRepository)  private appDatabaseRepository: AppDatabaseRepository;
  @inject(UserDatabasesRepository)  private userDatabasesRepository: UserDatabasesRepository;

  public async loadDatabases(): Promise<UserDatabase[]> {
    const loadedDatabases = await this.appDatabaseRepository
      .getAllDatabases();

    return loadedDatabases;
  }

  public async loginDatabase(bdId: string, pkey: string): Promise<UserDatabase | null> {
    const selectedDatabase = await this.appDatabaseRepository.getDatabaseById(bdId);

    const loggedBd = await this.userDatabasesRepository.updateDatabase(selectedDatabase.location);

    if (!loggedBd) {
      return null;
    }

    const publicDatabase = await this.userDatabasesRepository.auth(bdId, pkey);

    if (publicDatabase == null) {
      return null;
    }

    await this.appConfigurationRepository.setConfigurationByName(AppConfigurationDomains.AppConfig.names.SelectedDatabase, selectedDatabase.id);

    return selectedDatabase;
  }

  public async createDatabase(location: string, name: string, pKey: string): Promise<UserDatabase> {
    const selectedDatabase = await this.appDatabaseRepository.createNewDatabase(name, location);

    await DatabaseManager.createDatabase(selectedDatabase.location, selectedDatabase.id, selectedDatabase.name, pKey);

    return selectedDatabase;
  };

  public async importDatabase(location: string, privateKey: string): Promise<UserDatabase | null> {
    return await DatabaseManager.importDatabase(location, privateKey);
  }

  public async removeDatabase(id: string, confirmation: boolean, deleteDatabaseFile: boolean, privateKey: string): Promise<boolean> {
    if (!confirmation) {
      return false;
    }

    const selectedDatabase = await this.appDatabaseRepository.getDatabaseById(id);

    const authed = await DatabaseManager.loadDatabaseTemp(selectedDatabase.location, privateKey, async (database) => {
      const existingKey = crypto.createHmac('sha1', privateKey).digest('hex');

      const existingDatabasePublicRepository = database.getRepository(PublicDatabaseEntity);

      const publicInfos = await existingDatabasePublicRepository.find();

      if (publicInfos == null || publicInfos.length === 0) {
        return false;
      }

      const publicInfo = publicInfos[0];

      return (publicInfo != null && publicInfo.privateKey === existingKey);
    });

     if (!authed) {
       return false;
     }

    await this.appDatabaseRepository.removeDatabase(id);

    if (deleteDatabaseFile) {
      if (fs.existsSync(selectedDatabase.location)) {
        fs.rmSync(selectedDatabase.location);
      }

      if (fs.existsSync(`${selectedDatabase.location}-wal`)) {
        fs.rmSync(`${selectedDatabase.location}-wal`);
      }

      if (fs.existsSync(`${selectedDatabase.location}-shm`)) {
        fs.rmSync(`${selectedDatabase.location}-shm`);
      }
    }

    return true;
  }
}
