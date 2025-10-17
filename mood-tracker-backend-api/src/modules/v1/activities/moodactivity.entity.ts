import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { Mood } from '../moods/mood.entity';
import { ActivityEnum } from './enums/activity.enum';

@Entity('mood_activities')
export class MoodActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', enum: ActivityEnum, nullable: false })
    @Expose()
    label: ActivityEnum;  // le nom de l'activité

    @ManyToOne(() => Mood, (mood) => mood.activities, { onDelete: 'CASCADE' })
    mood: Mood;  // lien vers l’humeur
}