import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAttendanceDto {
    @ApiProperty({
        description: 'ID of the class being attended',
        type: Number,
        example: 4,
    })
    @IsNotEmpty()
    classID: number;
}
