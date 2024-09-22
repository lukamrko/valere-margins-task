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

  @Roles(1)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User successfully created',
      data: user,
    };
  }

  @Roles(1)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Roles(1)
  @Get(':id')
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
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `User with ID ${id} deleted successfully`,
    };
  }
}
