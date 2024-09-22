import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ReturnAttendanceDto } from './dto/return-attendance.dto';
import { JwtAuthGuard } from '../config/jwt-auth.guard';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';
import { Role } from '../config/role.enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin) // Adjust roles as necessary
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) { }

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto }> {
    const newAttendance = await this.attendancesService.create(createAttendanceDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Attendance successfully created',
      data: newAttendance,
    };
  }

  @Get()
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto[] }> {
    const attendances = await this.attendancesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Attendances retrieved successfully',
      data: attendances,
    };
  }

  @Get(':userID/:classID')
  async findOne(@Param('userID') userID: string, @Param('classID') classID: string): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto }> {
    const foundAttendance = await this.attendancesService.findOne(+userID, +classID);
    return {
      statusCode: HttpStatus.OK,
      message: `Attendance for User ID ${userID} and Class ID ${classID} retrieved successfully`,
      data: foundAttendance,
    };
  }

  @Delete(':userID/:classID')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('userID') userID: string, @Param('classID') classID: string): Promise<{ statusCode: number; message: string }> {
    await this.attendancesService.remove(+userID, +classID);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Attendance for User ID ${userID} and Class ID ${classID} deleted successfully`,
    };
  }
}
