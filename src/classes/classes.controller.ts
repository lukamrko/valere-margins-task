import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ReturnClassDto } from './dto/return-class.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enums';
import { FullReturnClassDTO } from './dto/full-return-class.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Classes')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('api/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class successfully created', type: ReturnClassDto })
  async create(@Body() createClassDto: CreateClassDto): Promise<{ statusCode: number; message: string; data: ReturnClassDto }> {
    const newClass = await this.classesService.create(createClassDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Class successfully created',
      data: newClass,
    };
  }

  @Get('all')
  @ApiOperation({ summary: 'Retrieve all classes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Classes retrieved successfully', type: [ReturnClassDto] })
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnClassDto[] }> {
    const classes = await this.classesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Classes retrieved successfully',
      data: classes,
    };
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  @ApiOperation({ summary: 'USED BY NORMAL USERS. Retrieve classes by sports names' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Classes with specified sports retrieved successfully', type: [ReturnClassDto] })
  async findAllByNames(@Query('sports') sports: string): Promise<{ statusCode: number; message: string; data: ReturnClassDto[] }> {
    const sportNames = sports.split(',');
    const classes = await this.classesService.findAllByNames(sportNames);

    return {
      statusCode: HttpStatus.OK,
      message: `Classes with sports: ${sportNames.join(', ')} retrieved successfully`,
      data: classes,
    };
  }

  @Roles(Role.Admin)
  @Get(':id/old')
  @ApiOperation({ summary: 'Retrieve a class without schedules by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Class retrieved successfully', type: ReturnClassDto })
  async findOneWithoutSchedules(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: ReturnClassDto }> {
    const classWithoutSchedules = await this.classesService.findOne(+id);

    return {
      statusCode: HttpStatus.OK,
      message: `Class with ID ${id} retrieved successfully`,
      data: classWithoutSchedules,
    };
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  @ApiOperation({ summary: 'USED BY NORMAL USERS. Retrieve a class with schedules by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Class with schedules retrieved successfully', type: FullReturnClassDTO })
  async findOneWithSchedules(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: FullReturnClassDTO }> {
    const classWithSchedules = await this.classesService.findOneWithSchedules(+id);

    return {
      statusCode: HttpStatus.OK,
      message: `Class with ID ${id} and its schedules retrieved successfully`,
      data: classWithSchedules,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a class by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Class updated successfully', type: ReturnClassDto })
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
  @ApiOperation({ summary: 'Delete a class by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Class deleted successfully' })
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.classesService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Class with ID ${id} deleted successfully`,
    };
  }
}
