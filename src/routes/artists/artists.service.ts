import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma.service';
import { checkUUID } from 'src/utils/checkUUID';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.artist.findMany({
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });
  }

  async findOne(id: string) {
    checkUUID(id);
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist with this id does not exist');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    return await this.prisma.artist.create({
      data: createArtistDto,
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    if (artist) {
      return await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
      });
    }
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    if (artist) {
      return await this.prisma.artist.delete({ where: { id } });
    }
  }
}
