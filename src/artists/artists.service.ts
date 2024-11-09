import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from 'src/database/database.service';
import { validate, v4 } from 'uuid';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(private database: DatabaseService) { }
  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || !grammy) {
      throw new HttpException('Name and grammy are required', HttpStatus.BAD_REQUEST);
    }
    const artist = new Artist({
      ...createArtistDto,
      id: v4(),
      name: name,
      grammy: grammy
    })
    this.database.artist.set(artist.id, artist);
    return artist;

  }

  findAll() {
    return Array.from(this.database.artist.values());
  }
  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    if (!this.database.artist.has(id)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.database.artist.get(id);
  }


  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    if (!this.database.artist.has(id)) throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    const artist = this.database.artist.get(id);
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;  
    return artist;
  }

  remove(id: string) {
    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    if (!this.database.artist.has(id)) throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    return this.database.artist.delete(id);
  }
}


