import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123', description: 'User password' })
    @IsNotEmpty()
    @Length(6, 20)
    password: string;

    @ApiProperty({ example: '1', description: 'User role. 1 is admin, 2 is normal user.' })
    @IsNotEmpty()
    roleID: number;
}
