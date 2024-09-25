import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Sport } from '../sports/entities/sport.entity';
import { Week } from '../weeks/entities/week.entity';
import { Class } from '../classes/entities/class.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Attendance } from '../attendances/entities/attendance.entity';

const validDbTypes = ['mysql', 'mariadb', 'postgres', 'sqlite', 'mssql'] as const;
type DbType = typeof validDbTypes[number];

function isValidDbType(type: string): type is DbType {
    return (validDbTypes as readonly string[]).includes(type);
}

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
    const dbType = configService.get<string>('DB_TYPE', 'sqlite');

    if (!isValidDbType(dbType)) {
        throw new Error(`Invalid DB_TYPE: ${dbType}`);
    }

    return {
        type: dbType, 
        database: configService.get<string>('DB_NAME', 'sport-complex-db.db'),
        entities: [User, Sport, Week, Class, Schedule, Attendance],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
    };
};
