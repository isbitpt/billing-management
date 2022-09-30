/* eslint-disable @typescript-eslint/naming-convention */
import {BaseAction} from '@isbit/render/core/store/actions/base-action';
import {createAction, props} from '@ngrx/store';
import * as sharedModels from '@isbit/shared';

export class ConfigurationAction extends BaseAction {
  public static ActionTypes = {
    LOAD_APP_CONFIGURATION_START_ACTION: ConfigurationAction.type('LOAD_APP_CONFIGURATION_START_ACTION'),
    LOAD_APP_CONFIGURATION_COMPLETE_ACTION: ConfigurationAction.type('LOAD_APP_CONFIGURATION_COMPLETE_ACTION'),

  };

  protected static getPrefix(): string {
    return 'Configuration';
  };
}

export const LoadAppConfigurationStartAction = createAction(
  ConfigurationAction.ActionTypes.LOAD_APP_CONFIGURATION_START_ACTION
);

export interface LoadAppConfigurationCompletePayload {
  lastSelectedDatabase: string;
}

export const LoadAppConfigurationCompleteAction = createAction(
  ConfigurationAction.ActionTypes.LOAD_APP_CONFIGURATION_COMPLETE_ACTION,
  props<LoadAppConfigurationCompletePayload>()
);
