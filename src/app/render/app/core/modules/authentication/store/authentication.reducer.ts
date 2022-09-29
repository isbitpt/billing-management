import produce from 'immer';
import {Action, createFeature, createReducer, on} from '@ngrx/store';

import {
  AuthToDatabaseCompleteAction, AuthToDatabaseCompletePayload,
  GetDatabasesCompleteAction,
  GetDatabasesCompletePayload
} from '@isbit/render/core/modules/authentication/store/authentication.action';

import * as models from '@isbit/render/core/modules/authentication/models';

export const authenticationFeatureKey = 'auth';

export interface AuthenticationState {
  databases: ReadonlyArray<models.DatabaseInfo>;
  loggedDatabase: models.DatabaseInfo;
}

const initialState: AuthenticationState = {
  databases: [],
  loggedDatabase: null
};

const reducer = createReducer(
  initialState,
  on(GetDatabasesCompleteAction, (state, pl): AuthenticationState => {
    const payload = pl as GetDatabasesCompletePayload;

    return produce(state, draft => {
      draft.databases = payload.databases;
    });
  }),
  on(AuthToDatabaseCompleteAction, (state, pl): AuthenticationState => {
    const payload = pl as AuthToDatabaseCompletePayload;

    return produce(state, draft => {
      draft.loggedDatabase = payload.loggedBd;
    });
  })
);

export const authenticationFeature = createFeature({
  name: authenticationFeatureKey,
  reducer: (state: AuthenticationState = initialState, action: Action) => reducer(state, action),
});
