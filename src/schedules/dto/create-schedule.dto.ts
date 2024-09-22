import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
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
