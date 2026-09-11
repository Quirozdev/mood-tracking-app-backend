import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../password/password.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { isUniqueViolation } from '../common/database/is-unique-violation';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

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
      if (isUniqueViolation(error)) {
        throw new ConflictException('An user with this email already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: AuthenticatedUser,
  ) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (currentUser.sub !== id) {
      throw new ForbiddenException('You cannot update another user');
    }
    const mergedUser = this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(mergedUser);
  }

  async updateAvatar(
    id: string,
    fileUrl: string,
    currentUser: AuthenticatedUser,
  ) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (currentUser.sub !== id) {
      throw new ForbiddenException('You cannot update another user');
    }
    user.avatarUrl = fileUrl;
    return await this.usersRepository.save(user);
  }
}
