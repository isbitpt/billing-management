import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as authenticationStore from '@isbit/render/core/modules/authentication/store';

@Injectable()
export class AuthenticationService {
  public databases$ = this.store.select(authenticationStore.selectDatabases);
  public loggedDatabase$ = this.store.select(authenticationStore.selectLoggedDatabase);

  constructor(
    private store: Store
  ) {}

  public getDatabases(): void {
    this.store.dispatch(authenticationStore.GetDatabasesStartAction());
  }

  public authToDatabase(databaseId: string, databaseKey: string): void {
    this.store.dispatch(authenticationStore.AuthenticateToDatabaseStartAction({databaseId, databaseKey}));
  }

  public createDatabase(name: string, location: string, privateKey: string) {
    this.store.dispatch(authenticationStore.CreateDatabaseStartAction({name, location, privateKey}));
  }

  public importDatabase(location: string, privateKey: string) {
    this.store.dispatch(authenticationStore.ImportDatabaseStartAction({location, privateKey}));
  }

  public removeDatabase(id: string, confirmation: boolean, deleteDatabaseFile: boolean, privateKey: string) {
    this.store.dispatch(authenticationStore.RemoveDatabaseStartAction({id, confirmation, deleteDatabaseFile, privateKey}));
  }
}
