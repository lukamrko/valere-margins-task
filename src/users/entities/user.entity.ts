// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    roleID: number;
}
