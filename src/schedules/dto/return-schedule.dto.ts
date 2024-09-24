import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ReturnClassDto } from 'src/classes/dto/return-class.dto';
import { ReturnWeekDto } from 'src/weeks/dto/return-week.dto';

export class ReturnScheduleDto {
    @ApiProperty({ description: 'The unique ID of the schedule' })
    @IsNotEmpty()
    scheduleID: number;

    @ApiProperty({ description: 'The day of the schedule' })
    @IsNotEmpty()
    day: string;

    @ApiProperty({ description: 'The start time of the schedule including date' })
    @IsNotEmpty()
    timeStart: Date;

    @ApiProperty({ description: 'The end time of the schedule including date' })
    @IsNotEmpty()
    timeEnd: Date;

    @ApiProperty({ description: 'The ID of the class associated with the schedule' })
    @IsNotEmpty()
    classID: number;

    @ApiProperty({ description: 'The ID of the week associated with the schedule' })
    @IsNotEmpty()
    weekID: number;
}
