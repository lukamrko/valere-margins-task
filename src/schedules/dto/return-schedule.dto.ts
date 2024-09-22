import { IsNotEmpty } from 'class-validator';
import { ReturnClassDto } from 'src/classes/dto/return-class.dto';
import { ReturnWeekDto } from 'src/weeks/dto/return-week.dto';

export class ReturnScheduleDto {
    @IsNotEmpty()
    scheduleID: number;

    @IsNotEmpty()
    day: string;

    @IsNotEmpty()
    timeStart: Date;

    @IsNotEmpty()
    timeEnd: Date;

    @IsNotEmpty()
    class: ReturnClassDto;

    @IsNotEmpty()
    week: ReturnWeekDto;
}
