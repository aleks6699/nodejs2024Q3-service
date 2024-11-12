import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4, validate } from 'uuid';
import { Album } from './entities/album.entity';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AlbumsService {
  constructor(private database: DatabaseService, private prisma: PrismaService) { }
  create(createAlbumDto: CreateAlbumDto) {   
    const album = new Album({
      ...createAlbumDto,
      id: v4(),

    })
    this.database.album.set(album.id, album);
    return album;
  }

  // findAll() {
  //   return Array.from(this.database.album.values());
  // }

  findAll() {
    console.log(this.prisma.album);
    return this.prisma.album.findMany();
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    if (!this.database.album.has(id)) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return this.database.album.get(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    if (!this.database.album.has(id)) throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    const album = this.database.album.get(id);
    Object.keys(updateAlbumDto).forEach((param) => {
      album[param] = updateAlbumDto[param];
    });
    return album;

  }

  remove(id: string) {
    if (!validate(id)) {
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    const album = this.database.album.get(id);
    if (!album) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    this.database.track.forEach((track) => {
        if (track.albumId === id) {
            track.albumId = null;
        }
    });

    const favoriteIndex = this.database.favorites.albums.findIndex((favAlbum) => favAlbum.id === id);
    if (favoriteIndex > -1) {
        this.database.favorites.albums.splice(favoriteIndex, 1);
    }

    this.database.album.delete(id);

    return null;
}

}

