import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password';
import { checkUUID } from 'src/utils/checkUUID';
import { PrismaService } from 'src/prisma.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToClass(User, user));
  }

  async findOne(id: string) {
    checkUUID(id);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const time = new Date();
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        version: 1,
        createdAt: time,
        updatedAt: time,
      },
    });

    return plainToClass(User, {
      ...newUser,
      createdAt: newUser.createdAt.getTime(),
      updatedAt: newUser.updatedAt.getTime(),
    });
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(id);
    if (user) {
      const userStoredPassword = user.password;

      if (updatePasswordDto.oldPassword !== userStoredPassword) {
        throw new ForbiddenException('Wrong old password');
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          password: updatePasswordDto.newPassword,
          version: user.version + 1,
          updatedAt: new Date(),
        },
      });

      return plainToClass(User, {
        ...updatedUser,
        updatedAt: updatedUser.updatedAt.getTime(),
        createdAt: updatedUser.createdAt.getTime(),
      });
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (user) {
      await this.prisma.user.delete({
        where: { id },
      });
    }
  }
}
