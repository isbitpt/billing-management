import {EventRegistry} from '../event-registry';
import {TYPES} from '@isbit/main/ioc';
import {provide} from 'inversify-binding-decorators';
import {AppEvent} from '../app-event';
import {inject} from 'inversify';
import {ConfigurationService} from '@isbit/main/services';

import * as sharedModels from '@isbit/shared';
import {AppConfigurationDomains} from '../../constants';
import {getConfigurationByName} from '../../utilities';

@provide(TYPES.AppEvent)
export class ConfigurationEvents implements EventRegistry {

  @inject(ConfigurationService) private configurationService: ConfigurationService;

  public getEvents(): AppEvent[] {
    return [{
      id: [
        'configuration:loadConfiguration'
      ],
      invokable: true,
      callback: async () => {
        const appConfigurations = await this.configurationService.loadAppConfiguration();

        const result: sharedModels.ConfigurationLoadConfigurationResultModel = {
          lastSelectedDatabase: getConfigurationByName(
            appConfigurations, AppConfigurationDomains.AppConfig.names.SelectedDatabase)?.value || null
        };

        return result;
      }
    }];
  }
}
