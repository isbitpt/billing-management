import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class UserDatabaseInfoEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;
}
