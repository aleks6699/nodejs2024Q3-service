import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import { checkUUID } from 'src/utils/checkUUID';
@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}
  async create(createAlbumDto: CreateAlbumDto) {
    return await this.prisma.album.create({
      data: {
        id: v4(),
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      },
    });
  }

  async findAll() {
    return await this.prisma.album.findMany({
      select: { id: true, name: true, year: true, artistId: true },
    });
  }

  async findOne(id: string) {
    checkUUID(id);

    const album = await this.prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        year: true,
        artistId: true,
      },
    });
    if (!album) {
      throw new NotFoundException('Album with this id does not exist');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    checkUUID(id);
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album with this id does not exist');
    }
    return await this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });
  }

  async remove(id: string) {
    checkUUID(id);

    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album with this id does not exist');
    }
    await this.prisma.album.delete({
      where: { id },
    });
    return null;
  }
}
