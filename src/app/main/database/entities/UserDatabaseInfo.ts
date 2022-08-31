import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserDatabaseInfo {

  @PrimaryGeneratedColumn("uuid")
  id: string
}
