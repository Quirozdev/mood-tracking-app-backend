import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'test@email.com',
  })
  email!: string;

  @IsStrongPassword()
  @MaxLength(55)
  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'Password1234.',
  })
  password!: string;
}
