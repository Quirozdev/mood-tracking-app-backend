import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarDto {
  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'Image file',
  })
  file!: string;
}
