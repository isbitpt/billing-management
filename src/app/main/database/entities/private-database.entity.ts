import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PrivateDatabaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  data: string;

  @Column()
  date: Date;
}
