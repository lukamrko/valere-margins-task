import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Attendance } from './entities/attendance.entity';
import { UsersModule } from 'src/users/users.module';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    UsersModule,
    ClassesModule],
  controllers: [AttendancesController],
  providers: [AttendancesService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
