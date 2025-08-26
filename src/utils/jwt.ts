import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class JwtUtilService {
  constructor(
    private jwt: JwtService,
    private env: ConfigService,
  ) {}

  generateToken(res: Response, payload: Record<string, string>) {
    const accessToken = this.jwt.sign(payload, {
      secret: this.env.get<string>('JWT_SECRET'),
      expiresIn: this.env.get<string>('JWT_EXPIRES_IN'),
    });

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return accessToken;
  }
}
