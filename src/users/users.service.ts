import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { validate, v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password';
import { checkUUID } from 'src/utils/checkUUID';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private database: DatabaseService, private prisma: PrismaService) { }
  async create(dto: CreateUserDto) {
    const { login, password } = dto;

    // Проверка на наличие логина и пароля
    if (!login || !password) {
      throw new HttpException('Login and password are required', HttpStatus.BAD_REQUEST);
    }

    // Проверка уникальности логина
    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      throw new HttpException('User with this login already exists', HttpStatus.BAD_REQUEST);
    }

    // Создание пользователя в базе данных через Prisma
   const user = await this.prisma.user.create({
      data: {
        login: login,
        password: password,
        id: uuid(), // Генерация UUID для пользователя
        version: 1,  // Начальная версия
        createdAt: new Date(1655000000 * 1000),  // Дата создания
        updatedAt: new Date(1655999999 * 1000),
      },
    });
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createAt: Math.floor(user.createdAt.getTime() / 1000), // Преобразуем в UNIX timestamp в секундах
      updateAt: Math.floor(user.updatedAt.getTime() / 1000), // Преобразуем в UNIX timestamp в секундах
    };
    // const createdAt = Date.now();
    // const user = new User({
    //   ...dto,
    //   login: login,
    //   id: uuid(),
    //   version: 1,
    //   createdAt: createdAt,
    //   updatedAt: createdAt,
    //   password: password
    // });
    // this.database.users.set(user.id, user);
    // return user
  }


  findAll() {
    // return Array.from(this.database.users.values());
    return this.prisma.user.findMany({
      select: {
        "id": true,
        "login": true,
        "version": true,
        "createdAt": true,
        "updatedAt": true
      }
    });
  }

  async findOne(id: string) {

    checkUUID(id);
    console.log(id);
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true

      }
    })
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;

    // if (!validate(id)) {
    //   throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    // }

    // if (!this.database.users.has(id)) {
    //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // }    
    // return this.database.users.get(id);
  }



  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;
    checkUUID(id);

    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { password: true },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (newPassword === undefined && oldPassword === undefined) throw new HttpException('New password is required', HttpStatus.BAD_REQUEST);

    if (oldPassword !== user.password) throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
 

  

    await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        version: {
          increment: 1
        }
      }
    })

    // if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    // if (!this.database.users.has(id)) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // if (oldPassword !== this.database.users.get(id).password) {
    //   throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    // }
    // return this.prisma.user.update({
    //   where: {
    //     id: id
    //   },
    //   data: {
    //     password: newPassword,
    //     version: {
    //       increment: 1
    //     },
    //     updatedAt: new Date()
    //   }
    // })

    // const user = this.database.users.get(id);

    // user.password = newPassword;
    // user.version += 1;
    // user.updatedAt = Date.now();
    // return user;

  }
  async remove(id: string) {
    checkUUID(id);

    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: { id }
    });
    return null

  }


  // if (!validate(id)) throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);

  // if (!this.database.users.has(id)) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  // return this.database.users.delete(id);
}

