import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sport } from '../../sports/entities/sport.entity'; 

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
}
