import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { ReturnSportDto } from './dto/return-sport.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles/role.enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('api/sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) { }

  @Post()
  async create(@Body() createSportDto: CreateSportDto): Promise<{ statusCode: number; message: string; data: ReturnSportDto }> {
    const sport = await this.sportsService.create(createSportDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Sport successfully created',
      data: sport,
    };
  }

  @Get()
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnSportDto[] }> {
    const sports = await this.sportsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Sports retrieved successfully',
      data: sports,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ statusCode: number; message: string; data: ReturnSportDto }> {
    const sport = await this.sportsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Sport with ID ${id} retrieved successfully`,
      data: sport,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSportDto: UpdateSportDto): Promise<{ statusCode: number; message: string; data: ReturnSportDto }> {
    const updatedSport = await this.sportsService.update(+id, updateSportDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Sport with ID ${id} updated successfully`,
      data: updatedSport,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.sportsService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Sport with ID ${id} deleted successfully`,
    };
  }
}
