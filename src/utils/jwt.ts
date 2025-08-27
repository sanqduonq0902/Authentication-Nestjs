import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import Redis from 'ioredis';
import { IJwtPayload } from 'src/interface/jwt';

@Injectable()
export class JwtUtilService {
  constructor(
    private jwt: JwtService,
    private env: ConfigService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  async generateToken(res: Response, payload: Record<string, string>) {
    const accessToken = this.jwt.sign(payload, {
      secret: this.env.get<string>('JWT_SECRET'),
      expiresIn: this.env.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.env.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.env.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.redis.set(
      `refresh_token:${payload.userId}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 7,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(res: Response, refreshToken: string) {
    const payload = this.jwt.verify(refreshToken, {
      secret: this.env.get('JWT_REFRESH_SECRET'),
    });

    const userId = payload.userId;

    const refresh = await this.redis.get(`refresh-token:${userId}`);
    if (!refresh) {
      throw new UnauthorizedException('Refresh token expired or not found');
    }

    const newAccessToken = await this.generateToken(res, { userId });
    return newAccessToken;
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    return await this.jwt.verify(token, {
      secret: this.env.get('JWT_SECRET'),
    });
  }
}
