import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/v1/users/users.module';
import { MoodsModule } from './modules/v1/moods/moods.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite', // le fichier sera créé automatiquement
            autoLoadEntities: true,      // charge automatiquement toutes les entités
            synchronize: true,           // crée automatiquement les tables (à désactiver en prod)
        }),
        UsersModule,
        MoodsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
