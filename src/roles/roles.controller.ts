import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';

@UseGuards(RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Roles(1)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Role successfully created',
      data: role,
    };
  }

  @Roles(1)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const roles = await this.rolesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Roles retrieved successfully',
      data: roles,
    };
  }

  @Roles(1)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Role with ID ${id} retrieved successfully`,
      data: role,
    };
  }

  @Roles(1)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.rolesService.update(+id, updateRoleDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Role with ID ${id} updated successfully`,
      data: updatedRole,
    };
  }

  @Roles(1)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.rolesService.remove(+id);
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