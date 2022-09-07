import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class UserDatabaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  privateKey: string;

  @Column()
  active: boolean;
}
