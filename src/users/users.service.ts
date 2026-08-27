import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../password/password.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly passwordManager: PasswordService,
  ) {}

  async findUserById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordManager.hash(
      createUserDto.password,
    );
    const user = this.usersRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashedPassword,
    });

    let savedUser: User;

    try {
      savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException('An user with this email already exists');
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const mergedUser = this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(mergedUser);
  }

  async updateAvatar(id: string, fileUrl: string) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.avatarUrl = fileUrl;
    return await this.usersRepository.save(user);
  }
}
