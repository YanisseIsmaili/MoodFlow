import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards, Request as NestRequest } from '@nestjs/common';
import { MoodsService } from './moods.service';
import { Mood } from './mood.entity';
import { CreateMoodDto } from './dtos/create-mood.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';
import { User } from '../users/user.entity';

@Controller('api/v1/moods')
export class MoodsController {
    constructor(private readonly moodsService: MoodsService) {}

    @Get()
    findAll(): Promise<Mood[]> {
        return this.moodsService.findAll();
    }

    @Get('user/:username')
    async findAllByUser(@Param('username') username: string) {
        const moods = await this.moodsService.findAllByUsername(username);
        return { count: moods.length, moods };
    }

    @Get(':username')
    @UseGuards(JwtAuthGuard)
    async findByUserAndMonth(
        @Query('date') date: string,
        @NestRequest() req: ExpressRequest
    ): Promise<Mood[]> {
        if (!date) {
            throw new BadRequestException('Date query parameter is required (e.g., ?date=2025-10-16)');
        }

        const user = req.user as User;

        return this.moodsService.findByUsernameAndMonth(date, user);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createMoodDto: CreateMoodDto,
        @NestRequest() req: ExpressRequest
    ) {
        // Cast vers User
        const user = req.user as User;
        return this.moodsService.create(createMoodDto, user);
    }
}
