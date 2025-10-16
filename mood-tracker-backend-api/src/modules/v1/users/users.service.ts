import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { username } });
    }

    async create(createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
        // Vérification email / username existants
        const existingUser = await this.userRepository.findOne({
            where: [
            { email: createUserDto.email },
            { username: createUserDto.username },
            ],
        });

        if (existingUser) {
            if (existingUser.email === createUserDto.email) {
                throw new HttpException('email already used', HttpStatus.BAD_REQUEST);
            }
            if (existingUser.username === createUserDto.username) {
                throw new HttpException('username already used', HttpStatus.BAD_REQUEST);
            }
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 = salt rounds

        // Création de l'utilisateur avec le mot de passe hashé
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);

        return {
            message: 'User created successfully',
            user: plainToInstance(User, savedUser, { excludeExtraneousValues: true }),
        };
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) return null;

        // Comparaison du mot de passe fourni avec le hash stocké
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return plainToInstance(User, user, { excludeExtraneousValues: true }); // utilisateur authentifié

    }

    async findByUuid(uuid: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { uuid } });
    }

}
