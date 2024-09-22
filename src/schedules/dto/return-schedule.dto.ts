import { IsNotEmpty } from 'class-validator';

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
    classID: number;

    @IsNotEmpty()
    weekID: number;
}
