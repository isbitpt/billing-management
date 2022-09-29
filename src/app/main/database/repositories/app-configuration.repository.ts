import {inject} from 'inversify';
import {Repository} from 'typeorm/repository/Repository';
import {DataSource} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {provide} from 'inversify-binding-decorators';


import {DatabaseSymbols} from '../database-symbols';
import {AppConfigurationEntity} from '@isbit/main/database';

@provide(AppConfigurationRepository)
export class AppConfigurationRepository {
  #dbRepo: Repository<AppConfigurationEntity>;

  constructor(@inject(DatabaseSymbols.applicationDatabaseSymbol) appDb: DataSource) {
    this.#dbRepo = appDb.getRepository(AppConfigurationEntity);
  }

  public async getConfigurationByName(configurationName: string): Promise<AppConfigurationEntity | null> {
    const configuration = await this.#dbRepo.findOneBy({
      name: configurationName
    });

    return configuration;
  }

  public async setConfigurationByName<T>(configurationName: string, value: T): Promise<AppConfigurationEntity> {
    const existingConfiguration = await this.getConfigurationByName(configurationName);

    let updatedEntity: AppConfigurationEntity;

    if (existingConfiguration == null) {
      updatedEntity = this.#dbRepo.create({
        id: uuidv4(),
        name: configurationName,
        value: value.toString()
      });
    } else {
      updatedEntity = this.#dbRepo.merge(existingConfiguration, {
        value: value.toString()
      });
    }

    return await this.#dbRepo.save(updatedEntity);
  }
}
