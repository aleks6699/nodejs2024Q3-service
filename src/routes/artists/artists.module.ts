import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, PrismaService],
})
export class ArtistsModule {}
