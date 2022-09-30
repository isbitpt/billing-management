import {inject} from 'inversify';
import {Repository} from 'typeorm/repository/Repository';
import {DataSource} from 'typeorm';
import {provide} from 'inversify-binding-decorators';


import {DatabaseSymbols} from '../database-symbols';
import {AppConfigurationEntity} from '@isbit/main/database';
import {AppConfigurationDomains} from '../../constants';

@provide(AppConfigurationRepository)
export class AppConfigurationRepository {
  #dbRepo: Repository<AppConfigurationEntity>;

  constructor(
    @inject(DatabaseSymbols.applicationDatabaseSymbol) appDb: DataSource) {
    this.#dbRepo = appDb.getRepository(AppConfigurationEntity);
  }

  public async getConfigurationByName(
    configurationDomain: string,
    configurationName: string): Promise<AppConfigurationEntity | null> {
    const configuration = await this.#dbRepo.findOneBy({
      domain: configurationDomain,
      name: configurationName
    });

    return configuration;
  }

  public async getAllConfigurationByDomain(
    configurationDomain: string): Promise<AppConfigurationEntity[] | null> {
    const configurations = await this.#dbRepo.findBy({
      domain: configurationDomain
    });

    return configurations;
  }

  public async setConfigurationByName<T>(
    configurationName: string,
    value: T): Promise<AppConfigurationEntity> {
    return await this.setConfigurationByDomainAndName<T>(AppConfigurationDomains.AppConfig.domain, configurationName, value);
  }

  public async setConfigurationByDomainAndName<T>(
    configurationDomain: string,
    configurationName: string,
    value: T): Promise<AppConfigurationEntity> {
    const existingConfiguration = await this.getConfigurationByName(configurationDomain, configurationName);

    let updatedEntity: AppConfigurationEntity;

    if (existingConfiguration == null) {
      updatedEntity = this.#dbRepo.create({
        domain: configurationDomain,
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
