import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { UsersModule } from '../users/users.module';
import { SportsModule } from '../sports/sports.module';
import { SchedulesModule } from 'src/schedules/schedules.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    UsersModule,
    SportsModule,
    forwardRef(() => SchedulesModule)],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule { }
