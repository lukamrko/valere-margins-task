import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sport {
    @PrimaryGeneratedColumn()
    sportID: number;

    @Column()
    name: string;
}
