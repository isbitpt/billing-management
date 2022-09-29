import {v4 as uuidv4} from 'uuid';
import {Repository} from 'typeorm/repository/Repository';
import {inject} from 'inversify';
import {DataSource} from 'typeorm';
import {provide} from 'inversify-binding-decorators';

import {DatabaseSymbols} from '../database-symbols';
import {AppDatabaseEntity} from '@isbit/main/database';

@provide(AppDatabaseRepository)
export class AppDatabaseRepository {
  #dbRepo: Repository<AppDatabaseEntity>;

  constructor(@inject(DatabaseSymbols.applicationDatabaseSymbol) appDb: DataSource) {
    this.#dbRepo = appDb.getRepository(AppDatabaseEntity);
  }

  public async getAllDatabases(): Promise<AppDatabaseEntity[]> {
    return await this.#dbRepo.find();
  }

  public async getDatabaseById(id: string): Promise<AppDatabaseEntity> {
    return await this.#dbRepo.findOneBy({
      id
    });
  }

  public async createNewDatabase(name: string, location: string): Promise<AppDatabaseEntity> {
    const bdId = uuidv4();

    const createdDb = this.#dbRepo.create({
      id: bdId,
      name,
      location: `${location}\\${bdId}.sqlite`
    });

    await this.#dbRepo.save(createdDb);

    return createdDb;
  }

  public async removeDatabase(id: string): Promise<boolean> {
    const existingDatabase = await this.getDatabaseById(id);

    try {
     await this.#dbRepo.remove(existingDatabase);

     return true;
   } catch (e) {
     return false;
   }
  }
}
