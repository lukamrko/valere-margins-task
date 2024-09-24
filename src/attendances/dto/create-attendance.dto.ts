import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
    @ApiProperty({
        description: 'ID of the user attending the class',
        type: Number,
        example: 1,
    })
    @IsNotEmpty()
    userID: number;

    @ApiProperty({
        description: 'ID of the class being attended',
        type: Number,
        example: 2,
    })
    @IsNotEmpty()
    classID: number;

    @ApiProperty({
        description: 'Timestamp of when the attendance was registered',
        type: Date,
        example: new Date().toISOString(),
    })
    registrationDateTime: Date;
}
