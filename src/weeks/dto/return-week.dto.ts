import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnWeekDto {
    @ApiProperty({
        description: 'The unique identifier of the week',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    weekID: number;

    @ApiProperty({
        description: 'The date of the week',
        example: '2024-09-24T00:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDate()
    date: Date;
}
