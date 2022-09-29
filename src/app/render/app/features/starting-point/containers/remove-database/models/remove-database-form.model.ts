export interface RemoveDatabaseFormModel {
  id: string;
  confirmation: boolean;
  privateKey: string;
  deleteDatabaseFile: boolean;
}

export enum RemoveDatabaseFormFields {
  id = 'id',
  confirmation = 'confirmation',
  privateKey = 'privateKey',
  deleteDatabaseFile = 'deleteDatabaseFile'
}
