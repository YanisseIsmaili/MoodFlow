import { Module } from '@nestjs/common';
import { MoodsController } from './moods.controller';
import { MoodsService } from './moods.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mood } from './mood.entity';
import { User } from '../users/user.entity';
import { MoodActivity } from '../activities/moodactivity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Mood, User, MoodActivity])],
    controllers: [MoodsController],
    providers: [MoodsService]
})
export class MoodsModule {}
