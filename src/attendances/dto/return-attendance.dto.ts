import { IsNotEmpty } from 'class-validator';
import { ReturnClassDto } from 'src/classes/dto/return-class.dto';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnAttendanceDto {
    @ApiProperty({
        description: 'User information related to the attendance',
        type: ReturnUserDto,
    })
    @IsNotEmpty()
    user: ReturnUserDto;

    @ApiProperty({
        description: 'Class information related to the attendance',
        type: ReturnClassDto,
    })
    @IsNotEmpty()
    class: ReturnClassDto;

    @ApiProperty({
        description: 'Timestamp of when the attendance was registered',
        type: Date,
        example: new Date().toISOString(),
    })
    @IsNotEmpty()
    registrationDateTime: Date;
}
