import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto'; // Adjust the path as necessary

@ApiTags('Login and registration')
@ApiBearerAuth('bearer')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login. Used to get bearer token.' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged in.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authDto: AuthDto) {
        const user = await this.authService.validateUser(authDto.email, authDto.password);
        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Invalid credentials',
            };
        }
        return this.authService.login(user);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'User registration. After this user can login and get bearer token.' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User already exists.' })
    async register(@Body() authDto: AuthDto) {
        const user = await this.authService.registerUser(authDto.email, authDto.password);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'User successfully registered',
            data: user,
        };
    }
}
