import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReturnSportDto {
    @ApiProperty({
        description: 'The unique identifier of the sport',
        example: 1,
    })
    @IsNotEmpty()
    sportID: number;

    @ApiProperty({
        description: 'The name of the sport',
        example: 'Football',
    })
    @IsNotEmpty()
    name: string;
}
