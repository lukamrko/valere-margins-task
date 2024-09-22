import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';

@Injectable()
export class SportsService {

  constructor(
    @InjectRepository(Sport)
    private readonly userRepository: Repository<Sport>
  ) { }

  create(createSportDto: CreateSportDto) {
    return 'This action adds a new sport';
  }

  findAll() {
    return `This action returns all sports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }

  update(id: number, updateSportDto: UpdateSportDto) {
    return `This action updates a #${id} sport`;
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
