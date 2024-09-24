import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSportDto {
    @ApiProperty({
        description: 'The name of the sport',
        example: 'Football',
    })
    @IsNotEmpty()
    name: string;
}
