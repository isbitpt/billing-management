import {createFeatureSelector, createSelector} from '@ngrx/store';
import {authenticationFeatureKey, AuthenticationState} from '@isbit/render/core/modules/authentication/store';

const selectState = createFeatureSelector<AuthenticationState>(authenticationFeatureKey);

export const selectDatabases = createSelector(selectState, state => state.databases);
export const selectLoggedDatabase = createSelector(selectState, state => state.loggedDatabase);
