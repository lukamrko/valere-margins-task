import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeekDto {
    @ApiProperty({
        description: 'The date of the week',
        example: '2024-09-24T00:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDate()
    date: Date;
}