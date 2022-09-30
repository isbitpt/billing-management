import {ConfigurationEffect} from '@isbit/render/core/modules/configuration/store/configuration.effect';

export * from './configuration.action';
export * from './configuration.effect';
export * from './configuration.reducer';
export * from './configuration.selectors';

export const EFFECTS = [
  ConfigurationEffect
];
