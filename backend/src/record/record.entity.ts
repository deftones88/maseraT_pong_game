import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
} from "typeorm";
import { User } from "src/user-info/entity/user.entity";

@Entity()
export class Record extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  isLadder: boolean;

  @Column()
  gameWin: boolean;

  @ManyToOne((type) => User, (user) => user.record)
  user: User;

  @ManyToOne((type) => User, (user) => user.record)
  enemy: User;
}
