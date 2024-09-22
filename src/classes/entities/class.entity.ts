import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Sport } from '../../sports/entities/sport.entity'; 
import { Attendance } from '../../attendances/entities/attendance.entity';

@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    classID: number;

    @Column()
    className: string;

    @Column()
    classDescription: string;

    @ManyToOne(() => Sport) 
    @JoinColumn({ name: 'sportID' }) 
    sport: Sport;

    @OneToMany(() => Attendance, attendance => attendance.class)
    attendances: Attendance[];
}
