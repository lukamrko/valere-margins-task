import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Attendance {
    @PrimaryColumn()
    userID: number;

    @PrimaryColumn()
    classID: number;

    @Column()
    registrationDateTime: Date;

    @ManyToOne(() => User, user => user.attendances)
    @JoinColumn({ name: 'userID' })
    user: User;

    @ManyToOne(() => Class, cls => cls.attendances)
    @JoinColumn({ name: 'classID' })
    class: Class;
}