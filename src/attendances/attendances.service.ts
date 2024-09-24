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
    private readonly usersService: UsersService,
  ) { }

  // Convert Attendance entity to ReturnAttendanceDto, ensuring type safety
  private async toReturnAttendanceDto(attendance: Attendance): Promise<ReturnAttendanceDto> {
    const returnClassDto = await this.classesService.findOne(attendance.class.classID);
    const returnUserDto = await this.usersService.findOne(attendance.user.userID);

    return {
      user: returnUserDto,
      class: returnClassDto,
      registrationDateTime: attendance.registrationDateTime,
    };
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<ReturnAttendanceDto> {
    const { classID, userID } = createAttendanceDto;

    const newAttendance = this.attendanceRepository.create({
      class: { classID },
      user: { userID },
      registrationDateTime: createAttendanceDto.registrationDateTime
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);

    return {
      ...savedAttendance
    };
  }

  async createFull(createAttendanceDto: CreateAttendanceDto): Promise<ReturnAttendanceDto> {
    const cls = await this.classesService.findOne(createAttendanceDto.classID);
    const user = await this.usersService.findOne(createAttendanceDto.userID);

    if (!cls) {
      throw new NotFoundException(`Class with ID ${createAttendanceDto.classID} not found`);
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${createAttendanceDto.userID} not found`);
    }

    const newAttendance = this.attendanceRepository.create({
      registrationDateTime: createAttendanceDto.registrationDateTime ?? new Date(),
      class: cls,
      user: user,
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);
    return this.toReturnAttendanceDto(savedAttendance);
  }

  // Fetch all attendances
  async findAll(): Promise<ReturnAttendanceDto[]> {
    const attendances = await this.attendanceRepository.find({ relations: ['class', 'user'] });
    return Promise.all(attendances.map(attendance => this.toReturnAttendanceDto(attendance)));
  }

  // Fetch all attendances for a specific user
  async findAllForUser(userID: number): Promise<ReturnAttendanceDto[]> {
    const attendances = await this.attendanceRepository.find({
      where: { user: { userID } },
      relations: ['class', 'user'],
    });
    if (!attendances.length) {
      throw new NotFoundException(`No attendances found for User ID ${userID}`);
    }
    return Promise.all(attendances.map(attendance => this.toReturnAttendanceDto(attendance)));
  }

  // Fetch all attendances for a specific class
  async findAllForClass(classID: number): Promise<ReturnAttendanceDto[]> {
    const attendances = await this.attendanceRepository.find({
      where: { class: { classID } },
      relations: ['class', 'user'],
    });
    if (!attendances.length) {
      throw new NotFoundException(`No attendances found for Class ID ${classID}`);
    }
    return Promise.all(attendances.map(attendance => this.toReturnAttendanceDto(attendance)));
  }

  // Fetch a specific attendance by userID and classID
  async findOne(userID: number, classID: number): Promise<ReturnAttendanceDto> {
    const attendance = await this.attendanceRepository.findOne({
      where: { user: { userID }, class: { classID } },
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

  // Remove an attendance
  async remove(userID: number, classID: number): Promise<void> {
    const result = await this.attendanceRepository.delete({ user: { userID }, class: { classID } });
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance not found for User ID ${userID} and Class ID ${classID}`);
    }
  }
}
