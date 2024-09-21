import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) { }

  private toReturnUserDto(user: User): ReturnUserDto {
    return {
      userID:user.userID,
      email:user.email,
      password:user.password,
      roleID: user.role.roleID,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const { roleID, ...userData } = createUserDto;
    const role = await this.rolesService.findOne(roleID);

    const newUser = this.userRepository.create({ ...userData, role });
    const savedUser = await this.userRepository.save(newUser);
    return this.toReturnUserDto(savedUser);
  }

  async findAll(): Promise<ReturnUserDto[]> {
    const users = await this.userRepository.find({ relations: ['role'] });
    return users.map(this.toReturnUserDto);
  }

  async findOne(id: number): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { userID: id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toReturnUserDto(user);
  }

  async findOneByEmail(email: string): Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return this.toReturnUserDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<ReturnUserDto> {
    const user = await this.userRepository.findOne({
      where: { userID: id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.toReturnUserDto(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
