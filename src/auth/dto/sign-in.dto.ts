import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsStrongPassword()
  @MaxLength(55)
  password!: string;
}
