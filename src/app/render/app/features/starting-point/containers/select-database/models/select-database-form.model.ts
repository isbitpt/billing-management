export interface SelectDatabaseFormModel {
  location: string;
  privateKey: string;
}

export enum SelectDatabaseFormFields {
  location = 'location',
  privateKey = 'privateKey'
}
