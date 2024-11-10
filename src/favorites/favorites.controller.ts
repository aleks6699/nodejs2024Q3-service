import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';


@Controller('favs')
@UsePipes(new ValidationPipe())
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Param('id') id: string) {
    return this.favoritesService.create("track", id);
  }
  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Param('id') id: string) {
    return this.favoritesService.create("artist", id);
  }
  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Param('id') id: string) {
    return this.favoritesService.create("album", id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)

  removeTrack(@Param('id') id: string) {
    return this.favoritesService.remove("track", id);
  }
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)

  removeAtrist(@Param('id') id: string) {
    return this.favoritesService.remove("artist", id);
  }
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.favoritesService.remove("album", id);
  }
}
