import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from '../../classes/entities/class.entity'; 
import { Week } from '../../weeks/entities/week.entity'; 

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    scheduleID: number;

    @Column()
    day: string;

    @Column()
    timeStart: Date;

    @Column()
    timeEnd: Date;

    @ManyToOne(() => Class)
    @JoinColumn({ name: 'classID' })
    class: Class;

    @ManyToOne(() => Week)
    @JoinColumn({ name: 'weekID' })
    week: Week;
}
