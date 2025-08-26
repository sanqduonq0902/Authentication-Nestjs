import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.services';
import { signUpDto } from './dtos/signup.dto';
import { Response } from 'express';
import { returnRes } from 'src/utils/return-response';
import { loginDto } from './dtos/login.dto';
import { JwtUtilService } from 'src/utils/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwt: JwtUtilService,
  ) {}

  @Post('signup')
  async signUp(@Body() dto: signUpDto, @Res() res: Response) {
    const result = await this.authService.signUp(dto);
    returnRes(res, HttpStatus.CREATED, 'Created user successfully', result);
  }

  @Post('login')
  async login(@Body() dto: loginDto, @Res() res: Response) {
    const data = await this.authService.login(dto);
    const payload = { userId: data.userId };
    const accessToken = this.jwt.generateToken(res, payload);
    returnRes(res, HttpStatus.OK, 'Logged in successfully', accessToken);
  }
}
