import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
    type: 'sqlite',
    database: 'sport-complex-db',
    entities: [User, Role],
    synchronize: true,
});