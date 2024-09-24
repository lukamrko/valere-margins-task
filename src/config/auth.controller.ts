import { Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Login and registration')
@Controller('api/auth')
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

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() registerDto: { email: string; password: string }) {
        const user = await this.authService.registerUser(registerDto.email, registerDto.password);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'User successfully registered',
            data: user,
        };
    }
}
