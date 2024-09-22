import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Week {
    @PrimaryGeneratedColumn()
    weekID: number;

    @Column()
    date: Date;
}
