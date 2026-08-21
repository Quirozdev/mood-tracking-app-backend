import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokensDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    default: 'refresh_token',
  })
  refreshToken!: string;
}
