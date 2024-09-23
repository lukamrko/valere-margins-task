import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ReturnAttendanceDto } from './dto/return-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { ClassesService } from 'src/classes/classes.service';
import { UsersService } from 'src/users/users.service';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Class } from 'src/classes/entities/class.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly classesService: ClassesService,
    private readonly usersService: UsersService
  ) { }

  private async toReturnAttendanceDto(attendance: Attendance): Promise<ReturnAttendanceDto> {
    const returnClassDto = await this.classesService.findOne(attendance.class.classID);
    const returnUserDto = await this.usersService.findOne(attendance.user.userID); // Adjust to your user retrieval method

    return {
      user: returnUserDto,
      class: returnClassDto,
      registrationDateTime: attendance.registrationDateTime,
    };
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<ReturnAttendanceDto> {
    const cls = await this.classesService.findOne(createAttendanceDto.classID);
    const user = await this.usersService.findOne(createAttendanceDto.userID);

    if (!cls) {
      throw new NotFoundException(`Class with ID ${createAttendanceDto.classID} not found`);
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${createAttendanceDto.userID} not found`);
    }

    const newAttendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      registrationDateTime: new Date(), // Set current date and time
      class: cls,
      user: user,
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);
    return this.toReturnAttendanceDto(savedAttendance);
  }

  async findAll(): Promise<ReturnAttendanceDto[]> {
    const attendances = await this.attendanceRepository.find({ relations: ['class', 'user'] });
    return Promise.all(attendances.map(attendance => this.toReturnAttendanceDto(attendance)));
  }

  async findOne(userID: number, classID: number): Promise<ReturnAttendanceDto> {
    const attendance = await this.attendanceRepository.findOne({
      where: { userID, classID },
      relations: ['class', 'user'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance not found for User ID ${userID} and Class ID ${classID}`);
    }
    return this.toReturnAttendanceDto(attendance);
  }

  async update(userID: number, classID: number, updateAttendanceDto: UpdateAttendanceDto): Promise<ReturnAttendanceDto> {
    const attendance = await this.attendanceRepository
      .findOne({ where: { userID: userID, classID: classID }, relations: ['user', 'class'] });

    if (!attendance) {
      throw new NotFoundException(`Schedule with combination of userID ${userID} and classID ${classID}`);
    }

    if (updateAttendanceDto.classID !== undefined) {
      const cls = await this.classesService.findOne(updateAttendanceDto.classID);
      if (!cls) {
        throw new NotFoundException(`Class with ID ${updateAttendanceDto.classID} not found`);
      }
      attendance.class = { classID: cls.classID } as Class;
    }

    if (updateAttendanceDto.userID !== undefined) {
      const user = await this.usersService.findOne(updateAttendanceDto.userID);
      if (!user) {
        throw new NotFoundException(`Week with ID ${updateAttendanceDto.userID} not found`);
      }
      attendance.user = { userID: user.userID } as User;
    }

    Object.assign(attendance, updateAttendanceDto);

    const updatedSchedule = await this.attendanceRepository.save(attendance);
    return this.toReturnAttendanceDto(updatedSchedule);
  }

  async remove(userID: number, classID: number): Promise<void> {
    const result = await this.attendanceRepository.delete({ userID, classID });
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance not found for User ID ${userID} and Class ID ${classID}`);
    }
  }
}
