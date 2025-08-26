import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.services';
import { signUpDto } from './dtos/signup.dto';
import { Response } from 'express';
import { returnRes } from 'src/utils/return-response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: signUpDto, @Res() res: Response) {
    const result = await this.authService.signUp(dto);
    returnRes(res, HttpStatus.CREATED, 'Created user successfully', result);
  }
}
