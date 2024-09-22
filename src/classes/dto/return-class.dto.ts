import { IsNotEmpty } from 'class-validator';
import { ReturnSportDto } from 'src/sports/dto/return-sport.dto';

export class ReturnClassDto {
    @IsNotEmpty()
    classID: number;

    @IsNotEmpty()
    className: string;

    classDescription: string;

    @IsNotEmpty()
    sport: ReturnSportDto;
}
