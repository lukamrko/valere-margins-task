import { Injectable } from '@nestjs/common';
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

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(newRole);
  }

  async findAll(): Promise<ReturnRoleDto[]> {
    const roles = await this.roleRepository.find();
    return roles.map(role => ({
      roleID: role.roleID,
      description: role.description,
    }));
  }

  async findOne(id: number): Promise<ReturnRoleDto> {
    const role = await this.roleRepository.findOne({ where: { roleID: id } });
    if (role) {
      return { roleID: role.roleID, description: role.description };
    }
    return null;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { roleID: id } });
    if (role) {
      Object.assign(role, updateRoleDto);
      return await this.roleRepository.save(role);
    }
    //TODO handle this case
    return null;
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
