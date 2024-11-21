import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  salt: number = +process.env.SALT;
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup({ login, password }: CreateUserDto): Promise<any> {
    try {
      const hashPassword = await bcrypt.hash(password, this.salt);
      const { id } = await this.usersService.create({
        login,
        password: hashPassword,
      });
      return { id, message: 'User registered successfully!' };
    } catch (error) {
      throw new BadRequestException();
    }
  }
  async login(login: string, password: string): Promise<any> {
    return await this.getToken(login, password);
  }

  async refresh(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const { login, sub } = payload;
      return await this.getToken(login, sub);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getToken(login: string, password: string): Promise<any> {
    const user = await this.usersService.findLoginOne(login);

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (user && passwordIsValid) {
      const payload = { login: user.login, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        }),
        refreshToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    }
    throw new BadRequestException();
  }
}
