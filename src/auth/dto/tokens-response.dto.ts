import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokensResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDFkM2MzMS0wYjc4LTQzZGQtYWFlNS1mNzhhNTA4MjQxZGYiLCJpYXQiOjE3ODg3NDkzNjUsImV4cCI6MTc4ODc1Mjk2NX0.h6XGjhDbgNpjH8oJFbsjUvQ2MxOvWnbV8acHyC9IU11',
  })
  accessToken!: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDFkM2MzMS0wYjc4LTQzZGQtYWFlNS1mNzhhNTA4MjQxZGYiLCJpYXQiOjE3ODg3NDkzNjUsImV4cCI6MTc5MTM0MTM2NX0.ZZcFKAgu5ufO6a3_Fbp7RkfadvGJkVqr6ImrSZp7ViB',
  })
  refreshToken!: string;
}
