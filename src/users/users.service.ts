import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../password/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly passwordManager: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordManager.hash(
      createUserDto.password,
    );
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
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
