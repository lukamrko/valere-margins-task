import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ReturnClassDto } from './dto/return-class.dto';
import { Class } from './entities/class.entity';
import { SportsService } from 'src/sports/sports.service';
import { FullReturnClassDTO } from './dto/full-return-class.dto';
import { SchedulesService } from 'src/schedules/schedules.service';

@Injectable()
export class ClassesService {

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly sportsService: SportsService,
    @Inject(forwardRef(() => SchedulesService))
    private readonly schedulesService: SchedulesService
  ) { }

  private async toReturnClassDto(cls: Class): Promise<ReturnClassDto> {
    const returnSportDto = await this.sportsService.findOne(cls.sport.sportID);
    return {
      classID: cls.classID,
      className: cls.className,
      classDescription: cls.classDescription,
      sport: returnSportDto
    };
  }

  async create(createClassDto: CreateClassDto): Promise<ReturnClassDto> {
    const sport = await this.sportsService.findOne(createClassDto.sportID);
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${createClassDto.sportID} not found`);
    }

    const newClass = this.classRepository.create({
      ...createClassDto,
      sport: sport, 
    });

    const savedClass = await this.classRepository.save(newClass);
    return this.toReturnClassDto(savedClass);
  }

  async findAll(): Promise<ReturnClassDto[]> {
    const classes = await this.classRepository.find({
      relations: ['sport'],
    });
    return Promise.all(classes.map(cls => this.toReturnClassDto(cls)));
  }

  async findAllByNames(names: string[]): Promise<ReturnClassDto[]> {
    const lowercaseNames = names.map(name => name.toLowerCase()); 

    const classes = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.sport', 'sport')
      .where('LOWER(sport.name) IN (:...names)', { names: lowercaseNames })
      .getMany();

    return Promise.all(classes.map(cls => this.toReturnClassDto(cls)));
  }

  async findOneWithSchedules(id: number): Promise<FullReturnClassDTO> {
    // Fetch the class with its sport relation
    const cls = await this.classRepository.findOne({
      where: { classID: id },
      relations: ['sport'],
    });

    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    // Fetch schedules using the SchedulesService
    const returnSchedules = await this.schedulesService.findSchedulesByClassId(id);

    // Return the full class data along with schedules
    return {
      ...await this.toReturnClassDto(cls), // ReturnClassDto data
      schedules: returnSchedules, // Schedules data
    };
  }

  async findOne(id: number): Promise<ReturnClassDto> {
    const cls = await this.classRepository.findOne({
      where: { classID: id },
      relations: ['sport'],
    });
    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return this.toReturnClassDto(cls);
  }

  async update(id: number, updateClassDto: UpdateClassDto): Promise<ReturnClassDto> {
    const cls = await this.classRepository.findOne({ where: { classID: id } });
    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    if (updateClassDto.sportID) {
      const sport = await this.sportsService.findOne(updateClassDto.sportID);
      if (!sport) {
        throw new NotFoundException(`Sport with ID ${updateClassDto.sportID} not found`);
      }
      cls.sport = sport;
    }

    Object.assign(cls, updateClassDto);
    const updatedClass = await this.classRepository.save(cls);
    return this.toReturnClassDto(updatedClass);
  }

  async remove(id: number): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }
}
