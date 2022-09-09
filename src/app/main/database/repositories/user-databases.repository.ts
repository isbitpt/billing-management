import {Repository} from 'typeorm/repository/Repository';
import {UserDatabaseEntity} from '../entities';
import {v4 as uuidv4} from 'uuid';
import * as crypto from 'crypto';
import {inject} from 'inversify';
import {Symbols} from '@isbit/main/managers';
import {DataSource} from 'typeorm';
import {provide} from 'inversify-binding-decorators';
import {TYPES} from '@isbit/main/ioc';

@provide(TYPES.Repository)
export class UserDatabasesRepository {
  #dbRepo: Repository<UserDatabaseEntity>;

  constructor(@inject(Symbols.applicationDatabaseSymbol) appDb: DataSource) {
    this.#dbRepo = appDb.getRepository(UserDatabaseEntity);
  }

  public async getAllDatabases(): Promise<UserDatabaseEntity[]> {
    return await this.#dbRepo.findBy({
      active: true
    });
  }

  public async createNewDatabase(dbName: string, pKey: string): Promise<UserDatabaseEntity> {
    const createdDb = this.#dbRepo.create({
      id: uuidv4(),
      active: true,
      name: dbName,
      privateKey: crypto.createHmac('sha1', pKey).digest('hex')
    });

    await this.#dbRepo.save(createdDb);

    return createdDb;
  }

  public async auth(bdId: string, pKey: string): Promise<UserDatabaseEntity | null> {
    const currentBd = await this.#dbRepo.findOneBy({
      id: bdId
    });

    if (currentBd == null) {
      return null;
    }

    const usedKey = crypto.createHmac('sha1', pKey).digest('hex');

    if (currentBd.privateKey === usedKey) {
      return currentBd;
    }

    return null;
  }
}
