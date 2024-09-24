import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { UsersModule } from '../users/users.module';
import { ClassesModule } from 'src/classes/classes.module';
import { WeeksModule } from 'src/weeks/weeks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    UsersModule,
    forwardRef(() => ClassesModule),
    WeeksModule],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
