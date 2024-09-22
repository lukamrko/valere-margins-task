import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateWeekDto {
    @IsNotEmpty()
    @IsDate()
    date: Date
}
