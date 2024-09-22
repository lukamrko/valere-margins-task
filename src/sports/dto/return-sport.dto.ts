import { IsNotEmpty } from 'class-validator';

export class ReturnSportDto {
    @IsNotEmpty()
    sportID: number;

    @IsNotEmpty()
    name: string;
}
