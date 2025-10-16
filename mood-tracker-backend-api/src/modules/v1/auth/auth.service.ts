import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../users/dtos/login.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) return null;

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);

        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const payload = { username: user.username, sub: user.uuid };
        const access_token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            access_token,
            user,
        };
    }

    async register(createUserDto: CreateUserDto) {
        try {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.usersService.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new HttpException('Un utilisateur avec cet email existe déjà', HttpStatus.CONFLICT);
            }

            const existingUsername = await this.usersService.findByUsername(createUserDto.username);
            if (existingUsername) {
                throw new HttpException('Ce nom d\'utilisateur est déjà pris', HttpStatus.CONFLICT);
            }

            // Créer l'utilisateur
            const result = await this.usersService.create(createUserDto);
            const user = result.user; // Récupérer l'utilisateur depuis le résultat

            // Générer le token JWT
            const payload = { username: user.username, sub: user.uuid };
            const access_token = this.jwtService.sign(payload);

            return {
                message: 'User registered successfully',
                access_token,
                user: {
                    uuid: user.uuid,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Erreur lors de la création du compte', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
