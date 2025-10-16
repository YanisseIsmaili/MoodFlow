import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { plainToInstance } from 'class-transformer';

@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
        return this.usersService.create(createUserDto);
    }

}
