import {createFeatureSelector, createSelector} from '@ngrx/store';
import {configurationFeatureKey, ConfigurationState} from '@isbit/render/core/modules/configuration/store';

const selectState = createFeatureSelector<ConfigurationState>(configurationFeatureKey);

export const selectLastSelectedDatabase = createSelector(selectState, state => state.lastSelectedDatabase);
