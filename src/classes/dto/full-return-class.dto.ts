import { PartialType } from '@nestjs/mapped-types';
import { ReturnClassDto } from './return-class.dto';
import { ReturnScheduleDto } from 'src/schedules/dto/return-schedule.dto';

export class FullReturnClassDTO extends PartialType(ReturnClassDto) {
    schedules: ReturnScheduleDto[];
}
