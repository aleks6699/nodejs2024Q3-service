import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    AlbumsModule,
    ArtistsModule,
    FavoritesModule,   
  ],
  controllers: [AppController],
  providers: [AppService , DatabaseService],
})
export class AppModule {}
