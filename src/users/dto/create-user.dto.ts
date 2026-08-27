import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @ApiProperty({
    type: String,
    description: 'Email',
    default: 'test@email.com',
  })
  email!: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Name',
    default: 'John Doe',
    nullable: true,
  })
  name!: string;

  @IsStrongPassword()
  @MaxLength(55)
  @ApiProperty({
    type: String,
    description: 'Password',
    default: 'Password1234.',
  })
  password!: string;
}
