import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { WeeksService } from './weeks.service';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';
import { ReturnWeekDto } from './dto/return-week.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles/role.enums';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Weeks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('api/weeks')
export class WeeksController {
  constructor(private readonly weeksService: WeeksService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new week' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Week successfully created', type: ReturnWeekDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Retrieve all weeks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Weeks retrieved successfully', type: [ReturnWeekDto] })
  async findAll(): Promise<{ statusCode: number; message: string; data: ReturnWeekDto[] }> {
    const weeks = await this.weeksService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Weeks retrieved successfully',
      data: weeks,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific week by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Week retrieved successfully', type: ReturnWeekDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Week not found' })
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
  @ApiOperation({ summary: 'Update a specific week by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Week updated successfully', type: ReturnWeekDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Week not found' })
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
  @ApiOperation({ summary: 'Delete a specific week by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Week deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Week not found' })
  async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
    await this.weeksService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Week with ID ${id} deleted successfully`,
    };
  }
}
