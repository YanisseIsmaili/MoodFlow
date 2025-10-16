import {
    IsNotEmpty,
    MaxLength,
    IsEnum,
    IsOptional,
    IsDateString,
    IsInt,
} from 'class-validator';
import { State } from '../enums/state.enum';
  
export class CreateMoodDto {

    @IsNotEmpty({ message: 'Date is required.' })
    @IsDateString({ strict: true }, { message: 'Date must be ISO format (YYYY-MM-DD).' })
    date: string;

    @IsOptional()
    @MaxLength(1000, { message: 'Description can\'t exceed 1000 characters.' })
    description?: string;

    @IsNotEmpty({ message: 'Mood state is required' })
    @IsEnum(State, { message: `Mood state must be one of the followings : ${Object.values(State).join(', ')}` })
    state: State;

    // @IsNotEmpty({ message: 'User ID is required.' })
    // @IsInt({ message: 'User ID must be an integer.' })
    // userId: number; // <- permet de lier l'humeur à un utilisateur

    @IsNotEmpty({ message: 'Username is required.' })
    username: string; // <- on utilise username à la place de userId

}