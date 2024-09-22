import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ReturnClassDto } from './dto/return-class.dto';
import { JwtAuthGuard } from '../config/jwt-auth.guard';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';
import { Role } from '../config/role.enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  async create(@Body() createClassDto: CreateClassDto): Promise<{ statusCode: number; message: string; data: ReturnClassDto }> {
    const newClass = await this.classesService.create(createClassDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Class successfully created',
      data: newClass,
    };
  }

  @Get()
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnClassDto[] }> {
    const classes = await this.classesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Classes retrieved successfully',
      data: classes,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: ReturnClassDto }> {
    const foundClass = await this.classesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Class with ID ${id} retrieved successfully`,
      data: foundClass,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto): Promise<{ statusCode: number; message: string; data: ReturnClassDto }> {
    const updatedClass = await this.classesService.update(+id, updateClassDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Class with ID ${id} updated successfully`,
      data: updatedClass,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.classesService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Class with ID ${id} deleted successfully`,
    };
  }
}
