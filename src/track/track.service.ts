import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from 'src/database/database.service';
import { Track } from './entities/track.entity';
import { v4, validate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private database: DatabaseService) { }
  create(createTrackDto: CreateTrackDto) {

    const track = new Track({
      ...createTrackDto,
      id: v4(),

    })
    this.database.track.set(track.id, track);
    return track

  }

  findAll() {
    return Array.from(this.database.track.values());

  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    if (!this.database.track.has(id)) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return this.database.track.get(id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    if (!this.database.artist.has(id)) throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    const track = this.database.artist.get(id);
    Object.keys(updateTrackDto).forEach((param) => {
      track[param] = updateTrackDto[param];
    });

    return track;
  }

  remove(id: string) {
    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    if (!this.database.track.has(id)) throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    return this.database.track.delete(id);
  }
}
