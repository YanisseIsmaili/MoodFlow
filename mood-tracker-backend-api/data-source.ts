import { Mood } from './src/modules/v1/moods/mood.entity';
import { User } from './src/modules/v1/users/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User, Mood],
    migrations: ['src/migrations/*.ts'],
});