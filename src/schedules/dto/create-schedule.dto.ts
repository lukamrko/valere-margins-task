import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
    @ApiProperty({ description: 'The day of the schedule', example: 'Monday' })
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
