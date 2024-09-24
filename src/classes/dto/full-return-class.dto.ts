import { PartialType } from '@nestjs/mapped-types';
import { ReturnClassDto } from './return-class.dto';
import { ReturnScheduleDto } from 'src/schedules/dto/return-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FullReturnClassDTO extends PartialType(ReturnClassDto) {
    @ApiProperty({ type: [ReturnScheduleDto], description: 'List of schedules associated with the class' })
    schedules: ReturnScheduleDto[];
}
