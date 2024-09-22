import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';
import { ReturnWeekDto } from './dto/return-week.dto';
import { Week } from './entities/week.entity';

@Injectable()
export class WeeksService {

  constructor(
    @InjectRepository(Week)
    private readonly weekRepository: Repository<Week>,
  ) { }

  private toReturnWeekDto(week: Week): ReturnWeekDto {
    return {
      weekID: week.weekID,
      date: week.date,
    };
  }

  async create(createWeekDto: CreateWeekDto): Promise<ReturnWeekDto> {
    const newWeek = this.weekRepository.create(createWeekDto);
    const savedWeek = await this.weekRepository.save(newWeek);
    return this.toReturnWeekDto(savedWeek);
  }

  async findAll(): Promise<ReturnWeekDto[]> {
    const weeks = await this.weekRepository.find();
    return weeks.map(this.toReturnWeekDto);
  }

  async findOne(id: number): Promise<ReturnWeekDto> {
    const week = await this.weekRepository.findOne({
      where: { weekID: id },
    });
    if (!week) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }
    return this.toReturnWeekDto(week);
  }

  async update(id: number, updateWeekDto: UpdateWeekDto): Promise<ReturnWeekDto> {
    const week = await this.weekRepository.findOne({ where: { weekID: id } });
    if (!week) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }
    Object.assign(week, updateWeekDto);
    const updatedWeek = await this.weekRepository.save(week);
    return this.toReturnWeekDto(updatedWeek);
  }

  async remove(id: number): Promise<void> {
    const result = await this.weekRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Week with ID ${id} not found`);
    }
  }
}
