import {UserDatabase} from './user-database.model';

export class AuthLoadDatabasesResult {
  databases: UserDatabase[];
  count: number;
}
