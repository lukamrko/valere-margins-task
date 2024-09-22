import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Attendance } from '../../attendances/entities/attendance.entity';

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

    @OneToMany(() => Attendance, attendance => attendance.user)
    attendances: Attendance[];
}