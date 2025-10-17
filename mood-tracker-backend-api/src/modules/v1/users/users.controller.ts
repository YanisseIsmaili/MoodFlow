import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, UseGuards, Request as NestRequest } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    // @Post()
    // create(@Body() createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
    //     return this.usersService.create(createUserDto);
    // }

    @UseGuards(JwtAuthGuard)
    @Delete('me')
    async deleteAccount(@NestRequest() req: ExpressRequest) {
        const user = req.user as User;

        const deleted = await this.usersService.deleteUserByUuid(user.uuid);

        if (!deleted) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return { message: 'Account deleted successfully' };
    }

}
