import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('it should be defined', () => {
    expect(passwordService).toBeDefined();
  });

  const rawPassword = 'Test1234.';

  describe('hash', () => {
    it('should return a hash different from the raw password', async () => {
      const hashedPassword = await passwordService.hash(rawPassword);
      expect(rawPassword).not.toBe(hashedPassword);
    });

    it('should produce a different hash even with same input', async () => {
      const rehashedPassword = await passwordService.hash(rawPassword);
      const hashedPassword = await passwordService.hash(rawPassword);
      expect(rehashedPassword).not.toEqual(hashedPassword);
    });
  });

  describe('compare', () => {
    it('should return true when the password matches the hash', async () => {
      const hashedPassword = await passwordService.hash(rawPassword);
      expect(await passwordService.compare(rawPassword, hashedPassword)).toBe(
        true,
      );
    });

    it('should return false when the password does not match the hash', async () => {
      const hashedPassword = await passwordService.hash(rawPassword);
      expect(
        await passwordService.compare('OtherPassword1234.', hashedPassword),
      ).toBe(false);
    });
  });
});
