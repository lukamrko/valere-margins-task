import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
    @IsNotEmpty()
    registrationDateTime: Date;
}
