import {Repository} from 'typeorm/repository/Repository';
import {UserDatabase} from '../entities/UserDatabase';
import {v4 as uuidv4} from 'uuid';
import * as crypto from 'crypto';

export class UserDatabasesRepository {
  constructor(private dbRepo: Repository<UserDatabase>) {
  }

  public async getAllDatabases(): Promise<UserDatabase[]> {
    return await this.dbRepo.findBy({
      active: true
    });
  }

  public async createNewDatabase(dbName: string, pKey: string): Promise<UserDatabase> {
    const createdDb = this.dbRepo.create({
      id: uuidv4(),
      active: true,
      name: dbName,
      privateKey: crypto.createHmac('sha1', pKey).digest('hex')
    });

    await this.dbRepo.save(createdDb);

    return createdDb;
  }

  public async auth(bdId: string, pKey: string): Promise<UserDatabase | null> {
    const currentBd = await this.dbRepo.findOneBy({
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
