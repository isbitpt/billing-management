import {AppEvent, EventRegistry} from '../EventManager';
import {AuthLoadDatabasesResult, AuthLoginToBdResult, UserDatabase} from '../../../shared';
import {AuthService} from '../../services';

export class AuthEvents implements EventRegistry{
  public getEvents(): AppEvent[] {
    return [{
      id: 'auth:loadDatabases',
      invokable: true,
      callback: async (evt) => {
        const loadedDatabases = await AuthService.loadDatabases();

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
        const authedDatabase = await AuthService.loginToBd(bdId, pKey);

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
