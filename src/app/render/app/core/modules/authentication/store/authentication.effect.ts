import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, tap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {Router} from '@angular/router';

import {ElectronService} from '@isbit/render/core/services';
import {
  AuthenticationAction,
  AuthToDatabaseCompleteAction,
  AuthToDatabaseCompletePayload,
  AuthenticateToDatabaseStartPayload,
  GetDatabasesCompleteAction,
  CreateDatabaseStartPayload,
  CreateDatabaseCompleteAction,
  GetDatabasesStartAction,
  ImportDatabaseStartPayload,
  ImportDatabaseCompleteAction,
  RemoveDatabaseStartPayload, RemoveDatabaseCompleteAction
} from '@isbit/render/core/modules/authentication/store';

import * as sharedModels from '@isbit/shared';

@Injectable()
export class AuthenticationEffect {

  public getDatabasesStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationAction.ActionTypes.GET_DATABASES_START_ACTION),
      mergeMap(() => this.electronService.invokeEvent<sharedModels.AuthLoadDatabasesResult>('authentication:loadDatabases')
        .pipe(
          catchError(e => EMPTY)
        )),
      mergeMap(res => of(GetDatabasesCompleteAction({ databases: res.databases})))
    ));

  public authToDatabaseStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationAction.ActionTypes.AUTHENTICATE_TO_DATABASE_START_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as AuthenticateToDatabaseStartPayload
      }))),
      mergeMap(a => this.electronService
        .invokeEvent<sharedModels.AuthLoginToBdResult>('authentication:canLogin', a.payload.databaseId, a.payload.databaseKey)
        .pipe(
          catchError(() => EMPTY)
        )),
      mergeMap(res => {
        if (!res.success) {
          return of(AuthToDatabaseCompleteAction({loggedBd: res.loggedBd, success: res.success}));
        }

        return of(AuthToDatabaseCompleteAction({loggedBd: res.loggedBd, success: res.success}));
      })
    ));

  public authToDatabaseComplete$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationAction.ActionTypes.AUTHENTICATE_TO_DATABASE_COMPLETE_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as AuthToDatabaseCompletePayload
      }))),
      tap(a => {
        if (!a.payload.success) {
          alert('Failed to login.');
          return;
        }

        return this.router.navigate(['management', a.payload.loggedBd.id]);
      })
    ), {
    dispatch: false
  });

  public createDatabaseStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationAction.ActionTypes.CREATE_DATABASE_START_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as CreateDatabaseStartPayload
      }))),
      mergeMap(action => {
        const request: sharedModels.AuthCreateDatabaseRequestModel = {
          name: action.payload.name,
          location: action.payload.location,
          privateKey: action.payload.privateKey
        };

        return this.electronService.invokeEvent<sharedModels.AuthCreateDatabaseResultModel>('authentication:createDatabase', request)
          .pipe(
            catchError(e => EMPTY)
          );
      }),
      mergeMap(res => [
        CreateDatabaseCompleteAction(res),
        GetDatabasesStartAction()
      ])
    ));

  public importDatabaseStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationAction.ActionTypes.IMPORT_DATABASE_START_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as ImportDatabaseStartPayload
      }))),
      mergeMap(action => {
        const request: sharedModels.AuthImportDatabaseRequestModel = {
          location: action.payload.location,
          privateKey: action.payload.privateKey
        };

        return this.electronService.invokeEvent<sharedModels.AuthImportDatabaseResultModel>('authentication:importDatabase', request)
          .pipe(
            catchError(e => EMPTY)
          );
      }),
      mergeMap(res => {

        if (res == null) {
          alert('Failed to import database');

          return EMPTY;
        }

        alert('Database imported');

        return [
          ImportDatabaseCompleteAction(res),
          GetDatabasesStartAction()
        ];
      })
    ));

  public removeDatabaseStart$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationAction.ActionTypes.REMOVE_DATABASE_START_ACTION),
      mergeMap((a: any) => of(({
        type: a.type,
        payload: a as RemoveDatabaseStartPayload
      }))),
      mergeMap(action => {
        const request: sharedModels.AuthRemoveDatabaseRequestModel = {
          id: action.payload.id,
          confirmation: action.payload.confirmation,
          deleteDatabaseFile: action.payload.deleteDatabaseFile,
          privateKey: action.payload.privateKey
        };

        return this.electronService.invokeEvent<sharedModels.AuthRemoveDatabaseResultModel>('authentication:removeDatabase', request)
          .pipe(
            catchError(e => EMPTY)
          );
      }),
      mergeMap(res => {
        if (!res || !res.success) {
          alert('Failed to remove database');

          return EMPTY;
        }

        alert('Database removed');

        return [
          RemoveDatabaseCompleteAction({removed: res.success}),
          GetDatabasesStartAction()
        ];
      })
    ));


  constructor(
    private router: Router,
    private actions$: Actions,
    private electronService: ElectronService
  ) {}
}
