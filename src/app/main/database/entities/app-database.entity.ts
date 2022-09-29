import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class AppDatabaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;
}
