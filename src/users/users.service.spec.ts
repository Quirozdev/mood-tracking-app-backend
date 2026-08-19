import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn((createUserDto: CreateUserDto) => createUserDto),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        PasswordService,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const email = 'test@email.com';
      const hashedPassword = 'hashed123';

      const createUserDto: CreateUserDto = {
        email: email,
        password: 'Test1234.',
      };

      const user: User = {
        id: '474d0676-dbe1-4788-b649-747ea12e87c8',
        name: 'Test',
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(passwordService, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await usersService.create(createUserDto);

      expect(passwordService.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(usersRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
      });

      expect(usersRepository.save).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
      });

      expect(result).toEqual(user);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user', async () => {
      const email = 'test@email.com';
      const hashedPassword = 'hashed123';

      const user: User = {
        id: '474d0676-dbe1-4788-b649-747ea12e87c8',
        name: 'Test',
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.findUserByEmail(email);

      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
    });

    it('should return null when user does not exist', async () => {
      const email = 'test@email.com';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await usersService.findUserByEmail(email);

      expect(result).toBeNull();

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
    });
  });
});
