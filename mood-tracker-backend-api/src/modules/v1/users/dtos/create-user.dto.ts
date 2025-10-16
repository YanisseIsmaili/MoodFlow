import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
    Length,
    IsEnum,
    IsOptional,
    IsNumber,
} from 'class-validator';
  
export class CreateUserDto {
    // @IsNumber()
    // @IsNotEmpty({message: 'clerkId is required'})
    // id: number;

    @IsOptional()
    @IsString({message: 'firstName must be a string'})
    @MaxLength(50, { message: 'firstName can\'t exceed 50 characters.' })
    firstName?: string;

    @IsOptional()
    @IsString({message: 'lastName must be a string'})
    @MaxLength(50, { message: 'lastName can\'t exceed 50 characters.' })
    lastName?: string;

    @IsNotEmpty({message: 'username is required'})
    @IsString({message: 'username must be a string'})
    @MaxLength(50, { message: 'username can\'t exceed 50 characters.' })
    username: string;

    @IsString({message: 'email must be a string'})
    @IsNotEmpty({message: 'email is required'})
    @IsEmail({}, { message: 'invalid email.' })
    @MaxLength(100, { message: 'email can\'t exceed 100 characters.' })
    email: string;

    @IsNotEmpty({ message: 'password is required' })
    @IsString({ message: 'password must be a string' })
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    @MaxLength(50, { message: 'Le mot de passe ne peut pas dépasser 50 caractères.' })
    @Matches(/(?=.*[A-Z])/, { message: 'Le mot de passe doit contenir au moins une lettre majuscule.' })
    @Matches(/(?=.*[a-z])/, { message: 'Le mot de passe doit contenir au moins une lettre minuscule.' })
    @Matches(/(?=.*\d)/, { message: 'Le mot de passe doit contenir au moins un chiffre.' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&).' })
    password: string;

    // @IsEnum(UserRole, { message: 'role must be one of: admin, free, or premium' })
    // role: UserRole;
}