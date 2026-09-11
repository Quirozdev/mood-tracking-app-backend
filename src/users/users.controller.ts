import {
  Body,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

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

  @Auth()
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
    @CurrentUser() currentUser: AuthenticatedUser,
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
    return this.usersService.updateAvatar(
      id,
      `${process.env.BASE_URL}/${file.path}`,
      currentUser,
    );
  }

  @Auth()
  @Put('/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UpdateUserDto,
  })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse({ summary: 'You cannot update another user' })
  @SerializeOptions({ type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto, currentUser);
  }
}
