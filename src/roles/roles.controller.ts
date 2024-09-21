import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

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