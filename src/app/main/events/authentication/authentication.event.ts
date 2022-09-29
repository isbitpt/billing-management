import {inject} from 'inversify';
import {provide} from 'inversify-binding-decorators';

import {AuthService} from '@isbit/main/services';
import {EventRegistry} from '../event-registry';
import {AppEvent} from '../app-event';

import {TYPES} from '@isbit/main/ioc';

import * as sharedModels from '@isbit/shared';

@provide(TYPES.AppEvent)
export class AuthEvents implements EventRegistry {

  @inject(AuthService) private authService: AuthService;

  public getEvents(): AppEvent[] {
    return [{
      id: 'authentication:loadDatabases',
      invokable: true,
      callback: async () => {
        const loadedDatabases = await this.authService.loadDatabases();

        const result: sharedModels.AuthLoadDatabasesResult = {
          databases: loadedDatabases.map(db => ({
            id: db.id,
            name: db.name
          })),
          count: loadedDatabases.length
        };


        return result;
      }
    },{
      id: 'authentication:canLogin',
      invokable: true,
      callback: async (evt, bdId: string, pKey: string) => {
        const authedDatabase = await this.authService.loginDatabase(bdId, pKey);

        const result: sharedModels.AuthLoginToBdResult = {
          loggedBd: authedDatabase == null ? null : {
            id: authedDatabase.id,
            name: authedDatabase.name
          },
          success: authedDatabase !== null
        };

        return result;
      }
    },{
      id: 'authentication:createDatabase',
      invokable: true,
      callback: async (evt, options: sharedModels.AuthCreateDatabaseRequestModel) => {
        const createdBd = await this.authService.createDatabase(options.location, options.name, options.privateKey);

        const result: sharedModels.AuthCreateDatabaseResultModel = {
          id: createdBd.id,
          name: createdBd.name
        };

        return result;
      }
    },{
      id: 'authentication:importDatabase',
      invokable: true,
      callback: async (evt, options: sharedModels.AuthImportDatabaseRequestModel) => {
        const createdBd = await this.authService.importDatabase(options.location, options.privateKey);

        if (createdBd == null) {
          return null;
        }

        const result: sharedModels.AuthImportDatabaseResultModel = {
          id: createdBd.id,
          name: createdBd.name
        };

        return result;
      }
    },{
      id: 'authentication:removeDatabase',
      invokable: true,
      callback: async (evt, options: sharedModels.AuthRemoveDatabaseRequestModel) => {
        const wasRemoved = await this.authService.removeDatabase(
          options.id,
          options.confirmation,
          options.deleteDatabaseFile,
          options.privateKey);

        const result: sharedModels.AuthRemoveDatabaseResultModel = {
          success: wasRemoved
        };

        return result;
      }
    }];
  }
}
