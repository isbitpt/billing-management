import {Repository} from 'typeorm/repository/Repository';
import {PublicDatabaseEntity} from '../entities';
import * as crypto from 'crypto';
import {provide} from 'inversify-binding-decorators';

import {DatabaseManager} from '../database.manager';

@provide(UserDatabasesRepository)
export class UserDatabasesRepository {
  #dbRepo: Repository<PublicDatabaseEntity>;

  public async updateDatabase(location: string): Promise<boolean> {
    const loadedDatabase = await DatabaseManager.loadUserDatabaseAsync(location);

    if (loadedDatabase == null) {
      return false;
    }

    this.#dbRepo = loadedDatabase
      .getRepository(PublicDatabaseEntity);

    return true;
  }

  public async auth(bdId: string, pKey: string): Promise<PublicDatabaseEntity | null> {
    this.checkDatabase();

    const currentBd = await this.#dbRepo.findOneBy({
      id: bdId
    });

    if (currentBd == null) {
      return null;
    }

    const usedKey = crypto.createHmac('sha1', pKey).digest('hex');

    if (currentBd.privateKey === usedKey) {
      process.env.currentBdKey = pKey;

      return currentBd;
    }

    return null;
  }

  private checkDatabase(): void {
    if (!!this.#dbRepo) {
      return;
    }

    throw new Error('User Database Not Selected!');
  }
}
