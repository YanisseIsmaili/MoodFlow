import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Mood } from './mood.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMoodDto } from './dtos/create-mood.dto';
import { User } from '../users/user.entity';
import { plainToInstance } from 'class-transformer';
import { State } from './enums/state.enum';
import { isAfter, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class MoodsService {

    constructor(
        @InjectRepository(Mood)
        private readonly moodRepository: Repository<Mood>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Mood[]> {
        return await this.moodRepository.find();
    }

    async create(createMoodDto: CreateMoodDto, user: User): Promise<{ message: string; mood: Mood }> {
        const normalizedState = createMoodDto.state.toUpperCase() as State;

        if (!Object.values(State).includes(normalizedState)) {
            throw new BadRequestException(
                `Invalid mood state: ${createMoodDto.state}. Possible states are: ${Object.values(State).join(', ')}`
            );
        }

        // Vérifier que la date n'est pas dans le futur
        const moodDate = parseISO(createMoodDto.date);
        const today = startOfDay(new Date());

        if (isAfter(moodDate, today)) {
            throw new BadRequestException('Cannot create a mood for a future date.');
        }

        // Vérifier si une humeur existe déjà pour ce jour et cet utilisateur
        let mood = await this.moodRepository.findOne({
            where: { user: { uuid: user.uuid }, date: createMoodDto.date },
            relations: ['user'],
        });

        if (mood) {
            // Mettre à jour l'humeur existante
            mood.state = normalizedState;
            mood.description = createMoodDto.description ?? mood.description;
            await this.moodRepository.save(mood);

            return {
                message: 'Mood updated successfully',
                mood: plainToInstance(Mood, mood, { excludeExtraneousValues: true }),
            };
        }

        // Créer une nouvelle humeur
        mood = this.moodRepository.create({
            ...createMoodDto,
            state: normalizedState,
            user,
        });

        const savedMood = await this.moodRepository.save(mood);

        return {
            message: 'Mood created successfully',
            mood: plainToInstance(Mood, savedMood, { excludeExtraneousValues: true }),
        };
    }

    async findAllByUsername(username: string): Promise<Mood[]> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException(`User with username "${username}" not found`);
        }

        return await this.moodRepository.find({
            where: { user: { uuid: user.uuid } },
            order: { date: 'DESC' }, // optionnel
        });
    }
    
    async findByUsernameAndMonth(date: string, user: User): Promise<Mood[]> {
        // Convertir la chaîne reçue en Date
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        // Calculer le premier et le dernier jour du mois
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth(); // 0-11

        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        // On récupère tous les moods du mois pour cet utilisateur
        const moods = await this.moodRepository.find({
            where: {
                user: { uuid: user.uuid },
                date: Between(
                    startOfMonth.toISOString().split('T')[0],
                    endOfMonth.toISOString().split('T')[0],
                ),
            },
            relations: ['user'],
        });

        return moods.map((mood) => plainToInstance(Mood, mood, { excludeExtraneousValues: true }));
    }
}
