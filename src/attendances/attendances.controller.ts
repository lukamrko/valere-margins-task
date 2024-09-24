import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ReturnAttendanceDto } from './dto/return-attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enums';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAttendanceDto } from './dto/user-attendance.dto';

@ApiTags('Attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) { }

  @Roles(Role.Admin, Role.User)
  @Post()
  @ApiOperation({ summary: 'USED BY NORMAL USERS. Create attendance via user key' })
  @ApiBody({ type: UserAttendanceDto }) // Document the body type
  @ApiResponse({ status: 201, description: 'Attendance successfully created.', type: ReturnAttendanceDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createViaUserKey(
    @Body() createAttendanceDto: { classID: number },
    @Request() req,
  ): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto }> {
    const userID = req.user.userID;

    const newAttendanceDto = new CreateAttendanceDto();
    newAttendanceDto.classID = createAttendanceDto.classID;
    newAttendanceDto.userID = userID;
    newAttendanceDto.registrationDateTime = new Date();

    const newAttendance = await this.attendancesService.create(newAttendanceDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Attendance successfully created',
      data: newAttendance,
    };
  }

  @Post('full')
  @ApiOperation({ summary: 'Create full attendance record' })
  @ApiBody({ type: CreateAttendanceDto }) // Document the body type
  @ApiResponse({ status: 201, description: 'Attendance successfully created.', type: ReturnAttendanceDto })
  async create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto }> {
    const newAttendance = await this.attendancesService.createFull(createAttendanceDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Attendance successfully created',
      data: newAttendance,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all attendances' })
  @ApiResponse({ status: 200, description: 'Attendances retrieved successfully', type: [ReturnAttendanceDto] })
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto[] }> {
    const attendances = await this.attendancesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Attendances retrieved successfully',
      data: attendances,
    };
  }

  @Get('user/:userID')
  @ApiOperation({ summary: 'Retrieve all attendances for a specific user' })
  @ApiResponse({ status: 200, description: 'Attendances for user retrieved successfully', type: [ReturnAttendanceDto] })
  async findAllForUser(@Param('userID') userID: string): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto[] }> {
    const foundAttendances = await this.attendancesService.findAllForUser(+userID);
    return {
      statusCode: HttpStatus.OK,
      message: `Attendances for User ID ${userID} retrieved successfully`,
      data: foundAttendances,
    };
  }

  @Get('class/:classID')
  @ApiOperation({ summary: 'Retrieve all attendances for a specific class' })
  @ApiResponse({ status: 200, description: 'Attendances for class retrieved successfully', type: [ReturnAttendanceDto] })
  async findAllForClass(@Param('classID') classID: string): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto[] }> {
    const foundAttendances = await this.attendancesService.findAllForClass(+classID);
    return {
      statusCode: HttpStatus.OK,
      message: `Attendances for Class ID ${classID} retrieved successfully`,
      data: foundAttendances,
    };
  }

  @Patch(':userID/:classID')
  @ApiOperation({ summary: 'Update attendance record for a specific user and class' })
  @ApiResponse({ status: 200, description: 'Attendance successfully updated.', type: ReturnAttendanceDto })
  async update(@Param('userID') userID: string, @Param('classID') classID: string, @Body() updateAttendanceDto: UpdateAttendanceDto): Promise<{ statusCode: number; message: string; data: ReturnAttendanceDto }> {
    const updatedSchedule = await this.attendancesService.update(+userID, +classID, updateAttendanceDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Schedule with User ID ${userID} and Class ID ${classID} updated successfully`,
      data: updatedSchedule,
    };
  }

  @Delete(':userID/:classID')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attendance record for a specific user and class' })
  @ApiResponse({ status: 204, description: 'Attendance successfully deleted.' })
  async remove(@Param('userID') userID: string, @Param('classID') classID: string): Promise<{ statusCode: number; message: string }> {
    await this.attendancesService.remove(+userID, +classID);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Attendance for User ID ${userID} and Class ID ${classID} deleted successfully`,
    };
  }
}
