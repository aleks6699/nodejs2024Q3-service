import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private salt: number;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    this.salt = parseInt(process.env.CRYPT_SALT);
  }

  async signup(login: string, password: string): Promise<any> {
    try {
      const hashPassword = await bcrypt.hash(password, this.salt);
      const { id } = await this.userService.create({
        login,
        password: hashPassword,
      });
      return { id, message: 'User registered successfully!' };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async login(login: string, password: string): Promise<any> {
    const user = await this.userService.findLoginOne(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, login: user.login };
    const tokens = await this.getToken(payload);
    return tokens;
  }

  async refresh(token: string): Promise<any> {
    if (!token) throw new UnauthorizedException('Refresh token is not valid');
    try {
      const { userId, login } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const payload = { userId: userId, login: login };
      return await this.getToken(payload);
    } catch (error) {
      throw new ForbiddenException('Refresh token is not valid');
    }
  }

  private async getToken(payload: { userId: string; login: string }) {
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
}
