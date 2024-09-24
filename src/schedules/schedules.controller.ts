import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ReturnScheduleDto } from './dto/return-schedule.dto';
import { JwtAuthGuard } from '../config/jwt-auth.guard';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';
import { Role } from '../config/role.enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('api/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto }> {
    const newSchedule = await this.schedulesService.create(createScheduleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Schedule successfully created',
      data: newSchedule,
    };
  }

  @Get()
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto[] }> {
    const schedules = await this.schedulesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Schedules retrieved successfully',
      data: schedules,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: ReturnScheduleDto }> {
    const foundSchedule = await this.schedulesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Schedule with ID ${id} retrieved successfully`,
      data: foundSchedule,
    };
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.schedulesService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Schedule with ID ${id} deleted successfully`,
    };
  }
}
