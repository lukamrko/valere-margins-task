import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { WeeksService } from './weeks.service';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';
import { ReturnWeekDto } from './dto/return-week.dto';
import { RolesGuard } from '../config/roles.guard';
import { Roles } from '../config/roles.decorator';
import { JwtAuthGuard } from '../config/jwt-auth.guard';
import { Role } from '../config/role.enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('api/weeks')
export class WeeksController {
  constructor(private readonly weeksService: WeeksService) { }

  @Post()
  async create(
    @Body() createWeekDto: CreateWeekDto
  ): Promise<{ statusCode: number; message: string; data: ReturnWeekDto }> {
    const week = await this.weeksService.create(createWeekDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Week successfully created',
      data: week,
    };
  }

  @Get()
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnWeekDto[] }> {
    const weeks = await this.weeksService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Weeks retrieved successfully',
      data: weeks,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<{ statusCode: number; message: string; data: ReturnWeekDto }> {
    const week = await this.weeksService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Week with ID ${id} retrieved successfully`,
      data: week,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWeekDto: UpdateWeekDto
  ): Promise<{ statusCode: number; message: string; data: ReturnWeekDto }> {
    const updatedWeek = await this.weeksService.update(+id, updateWeekDto);
    return {
      statusCode: HttpStatus.OK,
      message: `Week with ID ${id} updated successfully`,
      data: updatedWeek,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.weeksService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Week with ID ${id} deleted successfully`,
    };
  }
}
