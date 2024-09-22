import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ReturnUserDto {
    userID: number;
    
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    roleID: number;
}
