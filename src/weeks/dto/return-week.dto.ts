import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class ReturnWeekDto {
    @IsNumber()
    @IsNotEmpty()
    weekID: number;

    @IsNotEmpty()
    @IsDate()
    date: Date;
}
