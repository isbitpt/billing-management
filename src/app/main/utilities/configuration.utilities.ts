import {ConfigurationModel} from '../services/models';

export const getConfigurationByName = (configurations: ConfigurationModel[], name: string): ConfigurationModel | null =>
  configurations.find(config => config.name === name) || null;
