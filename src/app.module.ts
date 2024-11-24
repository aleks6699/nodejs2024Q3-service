import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './routes/users/users.module';
import { AlbumsModule } from './routes/albums/albums.module';
import { ArtistsModule } from './routes/artists/artists.module';
import { FavoritesModule } from './routes/favorites/favorites.module';
import { DatabaseService } from './database/database.service';
import { TrackModule } from './routes/track/track.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logging/logging.module';

@Module({
  imports: [
    UsersModule,
    TrackModule,
    AlbumsModule,
    ArtistsModule,
    FavoritesModule,
    TrackModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
