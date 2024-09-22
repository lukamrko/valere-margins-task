import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from "../users/entities/user.entity";
import { Sport } from "../sports/entities/sport.entity";
import { Week } from "../weeks/entities/week.entity";


export const databaseConfig = (): TypeOrmModuleOptions => ({
    type: 'sqlite',
    database: 'sport-complex-db.db',
    entities: [User, Sport, Week],
    synchronize: true,
});