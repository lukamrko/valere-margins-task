import { IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
    @IsNotEmpty()
    userID: number;
    @IsNotEmpty()
    classID: number;
}
