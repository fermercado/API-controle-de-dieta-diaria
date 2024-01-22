import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  dateTime!: Date;

  @Column()
  isDiet!: boolean;

  @ManyToOne(() => User, (user) => user.meals)
  user!: User;
}
