import {AppEvent, EventRegistry} from '@isbit/main/managers';
import {AuthLoadDatabasesResult, AuthLoginToBdResult} from '@isbit/shared';
import {AuthService} from '@isbit/main/services';
import {provide} from 'inversify-binding-decorators';
import {TYPES} from '@isbit/main/ioc';
import {inject} from 'inversify';

@provide(TYPES.AppEvent)
export class AuthEvents implements EventRegistry {

  @inject(AuthService) private authService: AuthService;

  public getEvents(): AppEvent[] {
    return [{
      id: 'auth:loadDatabases',
      invokable: true,
      callback: async (evt) => {
        const loadedDatabases = await this.authService.loadDatabases();

        const result: AuthLoadDatabasesResult = {
          databases: loadedDatabases.map(db => ({
            id: db.id,
            name: db.name
          })),
          count: loadedDatabases.length
        };


        return result;
      }
    },{
      id: 'auth:canLogin',
      invokable: true,
      callback: async (evt, bdId: string, pKey: string) => {
        const authedDatabase = await this.authService.loginDatabase(bdId, pKey);

        const result: AuthLoginToBdResult = {
          loggedBd: authedDatabase == null ? null : {
            id: authedDatabase.id,
            name: authedDatabase.name
          },
          success: authedDatabase !== null
        };

        return result;
      }
    }];
  }
}
