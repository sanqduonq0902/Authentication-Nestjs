import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.services';
import { signUpDto } from './dtos/signup.dto';
import { Request, Response } from 'express';
import { returnRes } from 'src/utils/return-response';
import { loginDto } from './dtos/login.dto';
import { JwtUtilService } from 'src/utils/jwt';
import { refreshTokenDto } from './dtos/refresh-token.dto';
import { changePasswordDto } from './dtos/change-password';
import { AuthGuard } from 'src/guards/auth.guards';
import { forgotPasswordDto } from './dtos/forgot-password';
import { verifyEmailDto } from './dtos/verify-emai';

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
    const accessToken = await this.jwt.generateToken(res, payload);
    returnRes(res, HttpStatus.OK, 'Logged in successfully', accessToken);
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: verifyEmailDto, @Res() res: Response) {
    await this.authService.verifyEmail(dto);
    returnRes(res, HttpStatus.OK, `Verified email ${dto.email} successfully`);
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: refreshTokenDto, @Res() res: Response) {
    const result = await this.jwt.refreshToken(res, dto.refreshToken);
    returnRes(res, HttpStatus.OK, 'Token fetched successfully', result);
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() dto: changePasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = req.userId;
    await this.authService.changePassword(dto, userId);
    returnRes(res, HttpStatus.OK, 'Changed password successfully');
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: forgotPasswordDto, @Res() res: Response) {
    await this.authService.forgotPassword(dto);
    returnRes(res, HttpStatus.OK, `Email sent to ${dto.email}`);
  }
}
