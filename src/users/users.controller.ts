import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: "Create an user"})
    @ApiCreatedResponse({ description: 'User created successfully', type: CreateUserDto})
    @ApiResponse({ status: 400, description: 'Bad Request'})
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }
}