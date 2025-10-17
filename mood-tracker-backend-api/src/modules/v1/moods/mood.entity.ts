import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Unique,
    OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Expose } from 'class-transformer';
import { State } from './enums/state.enum';
import { MoodActivity } from '../activities/moodactivity.entity';

@Entity('moods')
@Unique(['user', 'date']) // empêche deux humeurs pour le même user à la même date
export class Mood {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({ type: 'date', nullable: false })
    @Expose()
    date: string;

    @Column({ type: 'text', nullable: true })
    @Expose()
    description: string;

    @Column({ type: 'text', enum: State, nullable: false })
    @Expose()
    state: State;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.moods, { onDelete: 'CASCADE' })
    user: User;
    
    @OneToMany(() => MoodActivity, (activity) => activity.mood, { cascade: true, nullable: true })
    @Expose()
    activities?: MoodActivity[];
}
