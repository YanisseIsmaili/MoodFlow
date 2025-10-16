import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Unique,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('moods')
@Unique(['user', 'date']) // empêche deux humeurs pour le même user à la même date
export class Mood {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.moods, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 50 })
    state: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
