import { Injectable } from '@nestjs/common';
import { Artist } from 'src/artists/entities/artist.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DatabaseService {
  users = new Map<string, User>()
  artist = new Map<string, Artist>()
}
