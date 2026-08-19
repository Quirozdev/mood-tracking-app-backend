import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../password/password.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-reponse.dto';

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

    let savedUser: User;

    try {
      savedUser = await this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException('An user with this email already exists');
      }
      throw error;
    }
    return plainToInstance(UserResponseDto, savedUser);
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
