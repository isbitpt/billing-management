import {Column, Entity} from 'typeorm';
import {PrimaryColumn} from 'typeorm/decorator/columns/PrimaryColumn';

@Entity()
export class AppConfigurationEntity {
  @PrimaryColumn()
  domain: string;

  @PrimaryColumn()
  name: string;

  @Column()
  value: string;
}
