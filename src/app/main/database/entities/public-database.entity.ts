import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PublicDatabaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  privateKey: string;
}
