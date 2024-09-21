import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {User} from "./user.entity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleID: number;

  @Column()
  description: string;

  @OneToMany(()=>User, (user)=>user.role)
  users: User[]
}