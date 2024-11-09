import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  CreateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { validate, v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService) { }
  create(dto: CreateUserDto) {
    const { login, password } = dto;
    if (!login || !password) {
      throw new HttpException('Login and password are required', HttpStatus.BAD_REQUEST);
    }
    const createdAt = Date.now();
    const user = new User({
      ...dto,
      login: login,
      id: uuid(),
      version: 1,
      createdAt: createdAt,
      updatedAt: createdAt,
      password: password
    });
    this.database.users.set(user.id, user);
    return user
  }


  findAll() {
    return Array.from(this.database.users.values());
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    if (!this.database.users.has(id)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }    
    return this.database.users.get(id);
  }



  update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;

    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    if (!this.database.users.has(id)) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (oldPassword !== this.database.users.get(id).password) {
      throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    }
    if (newPassword === undefined && oldPassword === undefined) throw new HttpException('New password is required', HttpStatus.BAD_REQUEST);

    const user = this.database.users.get(id);



    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;

  }

  remove(id: string) {
    if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);

    if (!this.database.users.has(id)) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.database.users.delete(id);
  }
}
