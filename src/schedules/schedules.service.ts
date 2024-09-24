import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ReturnScheduleDto } from './dto/return-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ClassesService } from 'src/classes/classes.service';
import { WeeksService } from 'src/weeks/weeks.service';
import { Class } from 'src/classes/entities/class.entity';
import { Week } from 'src/weeks/entities/week.entity';

@Injectable()
export class SchedulesService {

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @Inject(forwardRef(() => ClassesService))
    private readonly classesService: ClassesService,
    private readonly weeksService: WeeksService
  ) { }

  private async toReturnScheduleDto(schedule: Schedule): Promise<ReturnScheduleDto> {
    const returnClassDto = await this.classesService.findOne(schedule.class.classID);
    const returnWeekDto = await this.weeksService.findOne(schedule.week.weekID);

    return {
      scheduleID: schedule.scheduleID,
      day: schedule.day,
      timeStart: schedule.timeStart,
      timeEnd: schedule.timeEnd,
      class: returnClassDto,
      week: returnWeekDto,
    };
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<ReturnScheduleDto> {
    const cls = await this.classesService.findOne(createScheduleDto.classID);
    const week = await this.weeksService.findOne(createScheduleDto.weekID);

    if (!cls) {
      throw new NotFoundException(`Class with ID ${createScheduleDto.classID} not found`);
    }
    if (!week) {
      throw new NotFoundException(`Week with ID ${createScheduleDto.weekID} not found`);
    }

    const newSchedule = this.scheduleRepository.create({
      ...createScheduleDto,
      class: cls,
      week: week,
    });

    const savedSchedule = await this.scheduleRepository.save(newSchedule);
    return this.toReturnScheduleDto(savedSchedule);
  }

  async findAll(): Promise<ReturnScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({ relations: ['class', 'week'] });
    return Promise.all(schedules.map(schedule => this.toReturnScheduleDto(schedule)));
  }

  async findOne(id: number): Promise<ReturnScheduleDto> {
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleID: id },
      relations: ['class', 'week'],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return this.toReturnScheduleDto(schedule);
  }

  async findSchedulesByClassId(classId: number): Promise<ReturnScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { class: { classID: classId } },
      relations: ['class', 'week'],
    });

    return Promise.all(schedules.map(schedule => this.toReturnScheduleDto(schedule)));
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<ReturnScheduleDto> {
    const schedule = await this.scheduleRepository.findOne({ where: { scheduleID: id }, relations: ['class', 'week'] });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    if (updateScheduleDto.classID !== undefined) {
      const cls = await this.classesService.findOne(updateScheduleDto.classID);
      if (!cls) {
        throw new NotFoundException(`Class with ID ${updateScheduleDto.classID} not found`);
      }
      schedule.class = { classID: cls.classID } as Class;
    }

    if (updateScheduleDto.weekID !== undefined) {
      const week = await this.weeksService.findOne(updateScheduleDto.weekID);
      if (!week) {
        throw new NotFoundException(`Week with ID ${updateScheduleDto.weekID} not found`);
      }
      schedule.week = { weekID: week.weekID } as Week;
    }

    Object.assign(schedule, updateScheduleDto);

    const updatedSchedule = await this.scheduleRepository.save(schedule);
    return this.toReturnScheduleDto(updatedSchedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }
}
