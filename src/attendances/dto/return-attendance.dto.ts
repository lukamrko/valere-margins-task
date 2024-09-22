import { IsNotEmpty } from 'class-validator';
import { ReturnClassDto } from 'src/classes/dto/return-class.dto';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';

export class CreateAttendanceDto {
    @IsNotEmpty()
    user: ReturnUserDto;
    @IsNotEmpty()
    class: ReturnClassDto;
    @IsNotEmpty()
    registrationDateTime: Date;
}
