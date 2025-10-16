import {
  Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Mood } from '../moods/mood.entity';
import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    uuid: string;

    @Column({ length: 50, nullable: true })
    @Expose()
    firstName: string;

    @Column({ length: 50, nullable: true })
    @Expose()
    lastName: string;

    @Column({ length: 50, unique: true, nullable: false })
    @Expose()
    username: string;

    @Column({ length: 100, unique: true, nullable: false })
    @Expose()
    email: string;

    @Column({ length: 50 })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // Relations
    @OneToMany(() => Mood, (mood) => mood.user)
    moods: Mood[];
}