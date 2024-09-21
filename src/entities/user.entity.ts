import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'roleID' })
    role: Role;
}