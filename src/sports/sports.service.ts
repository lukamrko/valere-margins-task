import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { ReturnSportDto } from './dto/return-sport.dto';
import { Sport } from './entities/sport.entity';

@Injectable()
export class SportsService {

  constructor(
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>
  ) { }

  private toReturnSportDto(sport: Sport): ReturnSportDto{
    return{
      sportID: sport.sportID,
      name: sport.name
    };
  }

  async create(createSportDto: CreateSportDto): Promise<ReturnSportDto> {
    const newSport = this.sportRepository.create(createSportDto);
    const savedSport = await this.sportRepository.save(newSport);
    return this.toReturnSportDto(savedSport);
  }

  async findAll(): Promise<ReturnSportDto[]> {
    const sports = await this.sportRepository.find();
    return sports.map(this.toReturnSportDto);
  }

  async findOne(id: number): Promise<ReturnSportDto> {
    const sport = await this.sportRepository.findOne({
      where: { sportID: id }
    });
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
    return this.toReturnSportDto(sport);
  }

  async update(id: number, updateSportDto: UpdateSportDto): Promise<ReturnSportDto> {
    const sport = await this.sportRepository.findOne({ where: { sportID: id } });
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
    Object.assign(sport, updateSportDto);
    const updatedSport = await this.sportRepository.save(sport);
    return this.toReturnSportDto(updatedSport);
  }

  async remove(id: number): Promise<void> {
    const result = await this.sportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
  }
}
