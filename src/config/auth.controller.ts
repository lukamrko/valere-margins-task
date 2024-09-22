import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../config/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: { email: string; password: string }) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Invalid credentials',
            };
        }
        return this.authService.login(user);
    }

    // A test route to verify token validity
    @UseGuards(JwtAuthGuard)
    @Post('test')
    async test(@Req() req) {
        return req.user;
    }
}
