import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Import UsersService
import { User } from '../users/entities/user.entity'; // Import User entity

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email); // Adjust to your user service method
        if (user && user.password === pass) {  // Use a hashed password in a real app
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userID };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
