import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService, PrismaService],
})
export class TrackModule {}
