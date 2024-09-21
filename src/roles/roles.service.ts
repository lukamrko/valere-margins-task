import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ReturnRoleDto } from './dto/return-role.dto';
import { Role } from './entities/role.entity';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  private toReturnRoleDto(role: Role): ReturnRoleDto {
    return {
      roleID: role.roleID,
      description: role.description,
    };
  }

  // Create a new role and return ReturnRoleDto
  async create(createRoleDto: CreateRoleDto): Promise<ReturnRoleDto> {
    const newRole = this.roleRepository.create(createRoleDto);
    const savedRole = await this.roleRepository.save(newRole);
    return this.toReturnRoleDto(savedRole);
  }

  // Find all roles and return a list of ReturnRoleDto
  async findAll(): Promise<ReturnRoleDto[]> {
    const roles = await this.roleRepository.find();
    return roles.map(this.toReturnRoleDto);
  }

  // Find a single role by ID and return ReturnRoleDto
  async findOne(id: number): Promise<ReturnRoleDto> {
    const role = await this.roleRepository.findOne({ where: { roleID: id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return this.toReturnRoleDto(role);
  }

  // Update an existing role and return ReturnRoleDto
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<ReturnRoleDto> {
    const role = await this.roleRepository.findOne({ where: { roleID: id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    Object.assign(role, updateRoleDto);
    const updatedRole = await this.roleRepository.save(role);
    return this.toReturnRoleDto(updatedRole);
  }

  // Delete a role by ID
  async remove(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}
