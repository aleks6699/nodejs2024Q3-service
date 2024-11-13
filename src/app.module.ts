import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DatabaseService } from './database/database.service';
import { TrackModule } from './track/track.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    UsersModule,
    // TrackModule,
    // AlbumsModule,
    // ArtistsModule,
    // FavoritesModule,
    // TrackModule,   
  ],
  controllers: [AppController],
  providers: [AppService , DatabaseService, PrismaService ],
})
export class AppModule {}
