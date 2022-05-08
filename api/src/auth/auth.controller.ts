import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      dto,
    );

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token: string | undefined = req.body.refresh_token;

    if (!token) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken, user } =
      await this.authService.refreshAccessToken(token);

    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    // TODO: invalidate refresh token
    return res.json({ success: true });
  }
}
