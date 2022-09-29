export interface CreateDatabaseFormModel {
  location: string;
  name: string;
  privateKey: string;
}

export enum CreateDatabaseFormFields {
  location = 'location',
  name = 'name',
  privateKey = 'privateKey'
}
