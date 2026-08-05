import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  @ApiProperty({
    type: String,
    description: 'Email',
    default: 'test@email.com',
  })
  email!: string;

  @IsStrongPassword()
  @MaxLength(55)
  @ApiProperty({
    type: String,
    description: 'Password',
    default: 'Password1234.',
  })
  password!: string;
}
