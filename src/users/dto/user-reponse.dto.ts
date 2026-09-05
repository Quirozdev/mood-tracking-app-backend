import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'ID',
    example: 'a21fb708-3d01-4875-957a-3872f0dd4f85',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Name',
    example: 'John Doe',
    nullable: true,
  })
  name!: string | null;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'test@email.com',
  })
  email!: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Avatar URL',
    example: 'https://test.com/image.jpeg',
    nullable: true,
  })
  avatarUrl!: string | null;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'createdAt',
    example: '2026-08-19T22:55:25.702Z',
  })
  createdAt!: Date;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'updatedAt',
    example: '2026-08-19T22:55:25.702Z',
    nullable: true,
  })
  updatedAt!: Date | null;
}
