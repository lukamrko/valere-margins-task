import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ReturnAttendanceDto } from './dto/return-attendance.dto';
import { JwtAuthGuard } from '../config/jwt-auth.guard';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';
import { Role } from '../config/role.enums';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

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

  // Fetch all attendances for a specific user
  @Get('user/:userID')
  async findAllForUser(@Param('userID') userID: string): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto[] }> {
    const foundAttendances = await this.attendancesService.findAllForUser(+userID);
    return {
      statusCode: HttpStatus.OK,
      message: `Attendances for User ID ${userID} retrieved successfully`,
      data: foundAttendances,
    };
  }

  // Fetch all attendances for a specific class
  @Get('class/:classID')
  async findAllForClass(@Param('classID') classID: string): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto[] }> {
    const foundAttendances = await this.attendancesService.findAllForClass(+classID);
    return {
      statusCode: HttpStatus.OK,
      message: `Attendances for Class ID ${classID} retrieved successfully`,
      data: foundAttendances,
    };
  }

  @Patch(':userID/:classID')
  async update(@Param('userID') userID: string, @Param('classID') classID: string, @Body() updateAttendanceDto: UpdateAttendanceDto): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto }> {
    const updatedSchedule = await this.attendancesService.update(+userID, +classID, updateAttendanceDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Schedule with  User ID ${userID} and Class ID ${classID} updated successfully`,
      data: updatedSchedule,
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
