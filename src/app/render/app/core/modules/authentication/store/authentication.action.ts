/* eslint-disable @typescript-eslint/naming-convention */
import {createAction, props} from '@ngrx/store';

import {BaseAction} from '@isbit/render/core/store/actions/base-action';
import * as sharedModels from '@isbit/shared';

export class AuthenticationAction extends BaseAction {
  public static ActionTypes = {
    GET_DATABASES_START_ACTION: AuthenticationAction.type('GET_DATABASES_START_ACTION'),
    GET_DATABASES_COMPLETE_ACTION: AuthenticationAction.type('GET_DATABASES_COMPLETE_ACTION'),

    AUTHENTICATE_TO_DATABASE_START_ACTION: AuthenticationAction.type('AUTHENTICATE_TO_DATABASE_START_ACTION'),
    AUTHENTICATE_TO_DATABASE_COMPLETE_ACTION: AuthenticationAction.type('AUTHENTICATE_TO_DATABASE_COMPLETE_ACTION'),

    CREATE_DATABASE_START_ACTION: AuthenticationAction.type('CREATE_DATABASE_START_ACTION'),
    CREATE_DATABASE_COMPLETE_ACTION: AuthenticationAction.type('CREATE_DATABASE_COMPLETE_ACTION'),

    IMPORT_DATABASE_START_ACTION: AuthenticationAction.type('IMPORT_DATABASE_START_ACTION'),
    IMPORT_DATABASE_COMPLETE_ACTION: AuthenticationAction.type('IMPORT_DATABASE_COMPLETE_ACTION'),

    REMOVE_DATABASE_START_ACTION: AuthenticationAction.type('REMOVE_DATABASE_START_ACTION'),
    REMOVE_DATABASE_COMPLETE_ACTION: AuthenticationAction.type('REMOVE_DATABASE_COMPLETE_ACTION'),
  };

  protected static getPrefix(): string {
    return 'Authentication';
  };
}

export const GetDatabasesStartAction = createAction(
  AuthenticationAction.ActionTypes.GET_DATABASES_START_ACTION
);

export interface GetDatabasesCompletePayload {
  databases: sharedModels.UserDatabase[];
}

export const GetDatabasesCompleteAction = createAction(
  AuthenticationAction.ActionTypes.GET_DATABASES_COMPLETE_ACTION,
  props<GetDatabasesCompletePayload>()
);

export interface AuthenticateToDatabaseStartPayload {
  databaseId: string;
  databaseKey: string;
}

export const AuthenticateToDatabaseStartAction = createAction(
  AuthenticationAction.ActionTypes.AUTHENTICATE_TO_DATABASE_START_ACTION,
  props<AuthenticateToDatabaseStartPayload>()
);

export interface AuthToDatabaseCompletePayload {
  loggedBd: sharedModels.UserDatabase;
  success: boolean;
}

export const AuthToDatabaseCompleteAction = createAction(
  AuthenticationAction.ActionTypes.AUTHENTICATE_TO_DATABASE_COMPLETE_ACTION,
  props<AuthToDatabaseCompletePayload>()
);

export interface CreateDatabaseStartPayload {
  name: string;
  location: string;
  privateKey: string;
}

export const CreateDatabaseStartAction = createAction(
  AuthenticationAction.ActionTypes.CREATE_DATABASE_START_ACTION,
  props<CreateDatabaseStartPayload>()
);

export interface CreateDatabaseCompletePayload {
  id: string;
  name: string;
}

export const CreateDatabaseCompleteAction = createAction(
  AuthenticationAction.ActionTypes.CREATE_DATABASE_COMPLETE_ACTION,
  props<CreateDatabaseCompletePayload>()
);

export interface ImportDatabaseStartPayload {
  location: string;
  privateKey: string;
}

export const ImportDatabaseStartAction = createAction(
  AuthenticationAction.ActionTypes.IMPORT_DATABASE_START_ACTION,
  props<ImportDatabaseStartPayload>()
);

export interface ImportDatabaseCompletePayload {
  id: string;
  name: string;
}

export const ImportDatabaseCompleteAction = createAction(
  AuthenticationAction.ActionTypes.IMPORT_DATABASE_COMPLETE_ACTION,
  props<ImportDatabaseCompletePayload>()
);

export interface RemoveDatabaseStartPayload {
  id: string;
  confirmation: boolean;
  deleteDatabaseFile: boolean;
  privateKey: string;
}

export const RemoveDatabaseStartAction = createAction(
  AuthenticationAction.ActionTypes.REMOVE_DATABASE_START_ACTION,
  props<RemoveDatabaseStartPayload>()
);

export interface RemoveDatabaseCompletePayload {
  removed: boolean;
}

export const RemoveDatabaseCompleteAction = createAction(
  AuthenticationAction.ActionTypes.REMOVE_DATABASE_COMPLETE_ACTION,
  props<RemoveDatabaseCompletePayload>()
);

