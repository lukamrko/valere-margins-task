import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ReturnClassDto } from './dto/return-class.dto';
import { Class } from './entities/class.entity';
import { SportsService } from 'src/sports/sports.service';
import { Sport } from 'src/sports/entities/sport.entity';

@Injectable()
export class ClassesService {

  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly sportsService: SportsService
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
    // Fetch the sport by its ID to ensure it exists
    const sport = await this.sportsService.findOne(createClassDto.sportID);
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${createClassDto.sportID} not found`);
    }

    // Create and save the new class with the sport relationship
    const newClass = this.classRepository.create({
      ...createClassDto,
      sport: sport, // Set the sport relationship
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
