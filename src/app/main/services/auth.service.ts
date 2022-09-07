import {UserDatabase} from './models/user-database';
import {UserDatabasesRepository} from '../database';
import {TYPES} from '../ioc';
import {provide} from 'inversify-binding-decorators';
import {inject} from 'inversify';

@provide(TYPES.Service)
export class AuthService {
  @inject(TYPES.Repository)  private userDatabasesRepository: UserDatabasesRepository;

  public async loadDatabases(): Promise<UserDatabase[]> {
    const loadedDatabases = await this.userDatabasesRepository
      .getAllDatabases();

    return loadedDatabases;
  }

  public async loginToBd(bdId: string, pkey: string): Promise<UserDatabase | null> {
    const loggedBd = await this.userDatabasesRepository
      .auth(bdId, pkey);

    return loggedBd;
  }
}
