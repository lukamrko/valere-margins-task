import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Import UsersService
import { User } from '../users/entities/user.entity'; // Import User entity
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from '../roles/role.enums';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password === password) { 
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async registerUser(email: string, password: string): Promise<ReturnUserDto> {
        const userForCreation = new CreateUserDto();
        userForCreation.email = email;
        userForCreation.password = password;
        userForCreation.roleID = Role.User;
        const response = await this.usersService.create(userForCreation);
        return response;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userID };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
