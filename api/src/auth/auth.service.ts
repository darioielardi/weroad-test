import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email, true);

    if (!user) {
      throw new UnauthorizedException('user-not-found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid-password');
    }

    const { accessToken, refreshToken } = this.createTokens(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const { sub: userId } = this.jwtService.verify(refreshToken, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });

    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      this.createTokens(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  createTokens(user: User) {
    return {
      accessToken: this.jwtService.sign(
        { sub: user.id, role: user.role },
        { expiresIn: '15m', secret: this.config.get('ACCESS_TOKEN_SECRET') },
      ),
      refreshToken: this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '7d', secret: this.config.get('REFRESH_TOKEN_SECRET') },
      ),
    };
  }
}
