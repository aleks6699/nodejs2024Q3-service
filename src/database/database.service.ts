import { Injectable } from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Favorites } from 'src/favorites/entities/favorite.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DatabaseService {
  users = new Map<string, User>()
  artist = new Map<string, Artist>()
  album = new Map<string, Album>()
  track = new Map<string, Track>()
  favorites = new Favorites();

}
