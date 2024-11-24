import { Album } from 'src/routes/albums/entities/album.entity';
import { Artist } from 'src/routes/artists/entities/artist.entity';
import { Track } from 'src/routes/track/entities/track.entity';

export class Favorites implements FavoritesResponse {
  artists = [];
  albums = [];
  tracks = [];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
