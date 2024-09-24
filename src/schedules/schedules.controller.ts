import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ReturnScheduleDto } from './dto/return-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enums';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Schedules')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('api/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Schedule successfully created', type: ReturnScheduleDto })
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto }> {
    const newSchedule = await this.schedulesService.create(createScheduleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Schedule successfully created',
      data: newSchedule,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all schedules' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Schedules retrieved successfully', type: [ReturnScheduleDto] })
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto[] }> {
    const schedules = await this.schedulesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Schedules retrieved successfully',
      data: schedules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a schedule by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Schedule retrieved successfully', type: ReturnScheduleDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Schedule not found' })
  async findOne(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto }> {
    const foundSchedule = await this.schedulesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Schedule with ID ${id} retrieved successfully`,
      data: foundSchedule,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a schedule by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Schedule updated successfully', type: ReturnScheduleDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Schedule not found' })
  async update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto }> {
    const updatedSchedule = await this.schedulesService.update(+id, updateScheduleDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Schedule with ID ${id} updated successfully`,
      data: updatedSchedule,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a schedule by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Schedule deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Schedule not found' })
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.schedulesService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Schedule with ID ${id} deleted successfully`,
    };
  }
}
