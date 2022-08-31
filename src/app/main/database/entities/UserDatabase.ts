import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserDatabase {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  privateKey: string;

  @Column()
  active: boolean;
}
