import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class UsersService {
    async create(createUserDto: CreateUserDto) {
       return createUserDto
    }
}