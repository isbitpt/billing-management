import {Action, createFeature, createReducer, on} from '@ngrx/store';
import produce from 'immer';

import * as ConfigurationActions from '@isbit/render/core/modules/configuration/store/configuration.action';

export const configurationFeatureKey = 'configuration';

export interface ConfigurationState {
  lastSelectedDatabase: string;
}

const initialState: ConfigurationState = {
  lastSelectedDatabase: null
};

const reducer = createReducer(
  initialState,
  on(ConfigurationActions.LoadAppConfigurationCompleteAction, (state, pl): ConfigurationState => {
    const payload = pl as ConfigurationActions.LoadAppConfigurationCompletePayload;

    return produce(state, draft => {
    draft.lastSelectedDatabase = payload.lastSelectedDatabase;
  });
})
);

export const configurationFeature = createFeature({
  name: configurationFeatureKey,
  reducer: (state: ConfigurationState = initialState, action: Action) => reducer(state, action),
});
