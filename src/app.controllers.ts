import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.services';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guards';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request) {
    return {
      message: 'Accessed Resource',
      userId: req.userId,
    };
  }
}
