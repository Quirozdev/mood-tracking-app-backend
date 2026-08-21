import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TokensService } from './tokens.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let passwordService: PasswordService;
  let tokensService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: TokensService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    passwordService = module.get<PasswordService>(PasswordService);
    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw unauthorized exception on non existing user', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);

      await expect(
        authService.signIn('test2@gmail.com', 'Test1234.'),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        'test2@gmail.com',
      );

      expect(passwordService.compare).not.toHaveBeenCalled();

      expect(tokensService.generateAccessToken).not.toHaveBeenCalled();
      expect(tokensService.generateRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw unauthorized exception on wrong password', async () => {
      const user: User = {
        id: '474d0676-dbe1-4788-b649-747ea12e87c8',
        name: 'Test',
        email: 'test@gmail.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(passwordService, 'compare').mockResolvedValue(false);

      await expect(
        authService.signIn('test@gmail.com', 'Test1234.'),
      ).rejects.toThrow(UnauthorizedException);

      expect(tokensService.generateAccessToken).not.toHaveBeenCalled();
      expect(tokensService.generateRefreshToken).not.toHaveBeenCalled();
    });

    it('should return access and refresh tokens on valid credentials', async () => {
      const user: User = {
        id: '474d0676-dbe1-4788-b649-747ea12e87c8',
        name: 'Test',
        email: 'test@gmail.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(passwordService, 'compare').mockResolvedValue(true);
      jest
        .spyOn(tokensService, 'generateAccessToken')
        .mockResolvedValueOnce('accessToken');
      jest
        .spyOn(tokensService, 'generateRefreshToken')
        .mockResolvedValueOnce('refreshToken');

      const result = await authService.signIn(user.email, 'Test1234.');

      expect(result).toStrictEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(user.email);

      expect(passwordService.compare).toHaveBeenCalledWith(
        'Test1234.',
        user.password,
      );
    });
  });
});
