import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return await this.usersRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }
}
