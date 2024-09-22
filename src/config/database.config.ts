import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from "../users/entities/user.entity";
import { Sport } from "../sports/entities/sport.entity";
import { Week } from "../weeks/entities/week.entity";
import { Class } from "../classes/entities/class.entity";
import { Schedule } from "../schedules/entities/schedule.entity";
import { Attendance } from "../attendances/entities/attendance.entity";


export const databaseConfig = (): TypeOrmModuleOptions => ({
    type: 'sqlite',
    database: 'sport-complex-db.db',
    entities: [User, Sport, Week, Class, Schedule, Attendance],
    synchronize: true,
});