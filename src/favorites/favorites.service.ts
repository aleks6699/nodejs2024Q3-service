import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  constructor(private database: DatabaseService) { }

  create(entity: 'track' | 'album' | 'artist', id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
  
    const found = this.database[entity].get(id);
    if (!found) {
      throw new HttpException(`${entity} not found`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  
    this.database.favorites[`${entity}s`].push(found);
    return null;
  }
  
  findAll() {
    return this.database.favorites;
  }
  
  remove(entity: 'track' | 'album' | 'artist', id: string) {
    const entityArray = this.database.favorites[`${entity}s`];
    const index = entityArray.findIndex((item: { id: string }) => item.id === id);  
    if (index === -1) {
      throw new HttpException(`${entity} not found`, HttpStatus.NOT_FOUND);
    }  
    entityArray.splice(index, 1);
    return null;
  }

}
