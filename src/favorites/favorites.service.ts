import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from 'src/prisma.service';
import { checkUUID } from 'src/utils/checkUUID';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  constructor(private database: DatabaseService, private prisma: PrismaService) { }

  async createArtist(id: string) {
    checkUUID(id)
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id
      }
    })
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.prisma.artist.update({
      where: {
        id: id
      },
      data: {
        isFavorite: true
      }
    })

  }
  async createAlbum(id: string) {
    checkUUID(id)
    const album = await this.prisma.album.findUnique({
      where: {
        id: id
      }
    })
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.prisma.album.update({
      where: {
        id: id
      },
      data: {
        isFavorite: true
      }
    })
  }
  async createTrack(id: string) {
    checkUUID(id)
    const track = await this.prisma.track.findUnique({
      where: {
        id: id
      }
    })
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.prisma.track.update({
      where: {
        id: id
      },
      data: {
        isFavorite: true
      }
    })
  }


  async findAll() {
    const artists = await this.prisma.artist.findMany({
      where: { isFavorite: true },
      select: { id: true, name: true, grammy: true },
    });
    const albums = await this.prisma.album.findMany({
      where: { isFavorite: true },
      select: { id: true, name: true, year: true, artistId: true },
    });
    const tracks = await this.prisma.track.findMany({
      where: { isFavorite: true },
      select: { id: true, name: true,  artistId: true, albumId: true, duration: true },
    });
  
    return { artists , albums, tracks };
  }
  

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id
      }
    })
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.artist.update({
      where: {
        id: id
      },
      data: {
        isFavorite: false
      }
    })
  }
  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id
      }
    })
    if (!album) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.album.update({
      where: {
        id: id
      },
      data: {
        isFavorite: false
      }
    })

  }
  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id
      }
    })
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.track.update({
      where: {
        id: id
      },
      data: {
        isFavorite: false
      }
    })
  }
}
