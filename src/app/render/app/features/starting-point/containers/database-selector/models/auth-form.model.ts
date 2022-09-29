export interface AuthFormModel {
  selectedDatabase: string;
  password: string;
}

export enum AuthFields {
  selectedDatabase = 'selectedDatabase',
  password = 'password'
}
