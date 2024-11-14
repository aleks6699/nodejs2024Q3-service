import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4, validate } from 'uuid';
import { checkUUID } from 'src/utils/checkUUID';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) { }
  async create(createTrackDto: CreateTrackDto) {

    const track = await this.prisma.track.create({
      data: {
        ...createTrackDto,
        id: v4(),
      }
    })

    return track

  }

  async findAll() {
    const tracks = await this.prisma.track.findMany({
      select: {
        id: true,
        name: true,
        duration: true,
        albumId: true,
        artistId: true
      },
    });
    return tracks
  }

  async findOne(id: string) {
    checkUUID(id);
    const track = await this.prisma.track.findUnique({
      where: {
        id: id
      }
    })
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    checkUUID(id);
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
        ...updateTrackDto
      }
    })

  }

  async remove(id: string) {
    checkUUID(id);
    const track = await this.prisma.track.findUnique({
      where: {
        id: id
      }
    })
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.track.delete({
      where: {
        id: id
      }
    })
  }
}
