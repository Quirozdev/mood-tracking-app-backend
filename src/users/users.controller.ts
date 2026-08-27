import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-reponse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/update-user-dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @SerializeOptions({ type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('/:id/upload-avatar')
  @ApiOperation({ summary: 'Upload an avatar for own profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAvatarDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
      }),
    }),
  )
  @SerializeOptions({ type: UserResponseDto })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 250 * 1024 }),
          // new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(`${__dirname}/${file.path}`);
    return this.usersService.updateAvatar(
      id,
      `${process.env.BASE_URL}/${file.path}`,
    );
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UpdateUserDto,
  })
  @ApiBadRequestResponse()
  @SerializeOptions({ type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }
}
