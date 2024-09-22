import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';
import { JwtAuthGuard } from '../config/jwt-auth.guard';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Roles(1)
  @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User successfully created',
      data: user,
    };
  }

  @Roles(1, 2)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Roles(1, 2)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `User with ID ${id} retrieved successfully`,
      data: user,
    };
  }

  @Roles(1)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: `User with ID ${id} updated successfully`,
      data: updatedUser,
    };
  }

  @Roles(1)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.usersService.remove(+id);
      res.status(HttpStatus.NO_CONTENT).json({
        statusCode: HttpStatus.NO_CONTENT,
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }
}
