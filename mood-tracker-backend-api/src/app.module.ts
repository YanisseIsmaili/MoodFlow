import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/v1/users/users.module';
import { MoodsModule } from './modules/v1/moods/moods.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite', // le fichier sera créé automatiquement
            autoLoadEntities: true,      // charge automatiquement toutes les entités
            synchronize: true,           // crée automatiquement les tables (à désactiver en prod)
        }),
        UsersModule,
        MoodsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
