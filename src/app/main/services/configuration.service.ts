import {inject} from 'inversify';
import {provide} from 'inversify-binding-decorators';

import {AppConfigurationRepository} from '@isbit/main/database';
import {AppConfigurationDomains} from '../constants';

import * as models from './models';

@provide(ConfigurationService)
export class ConfigurationService {
  @inject(AppConfigurationRepository)  private appConfigurationRepository: AppConfigurationRepository;

  public async loadAppConfiguration(): Promise<models.ConfigurationModel[]> {
    const configs = await this.appConfigurationRepository.getAllConfigurationByDomain(AppConfigurationDomains.AppConfig.domain);

    if (configs == null) {
      return [];
    }

    return configs;
  }
}
