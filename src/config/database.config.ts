import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from "../users/entities/user.entity";

export const databaseConfig = (): TypeOrmModuleOptions => ({
    type: 'sqlite',
    database: 'sport-complex-db.db',
    entities: [User],
    synchronize: true,
});