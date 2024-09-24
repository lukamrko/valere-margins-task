import { IsNotEmpty } from 'class-validator';
import { ReturnSportDto } from 'src/sports/dto/return-sport.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnClassDto {
    @ApiProperty({ description: 'Unique identifier of the class' })
    @IsNotEmpty()
    classID: number;

    @ApiProperty({ description: 'The name of the class' })
    @IsNotEmpty()
    className: string;

    @ApiProperty({ description: 'Description of the class', required: false })
    classDescription?: string;

    @ApiProperty({ type: ReturnSportDto, description: 'Associated sport details' })
    @IsNotEmpty()
    sport: ReturnSportDto;
}
