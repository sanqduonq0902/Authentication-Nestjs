import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './entities/user.entity';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.services';
import { JwtUtilService } from 'src/utils/jwt';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/config/redis.config';
import { AuthGuard } from 'src/guards/auth.guards';
import { JwtConfigModule } from 'src/config/jwt.config';
import { MailService } from 'src/services/mail.services';
import { OTPService } from 'src/services/otp.services';
import { RateLimitService } from 'src/services/rate-limit.services';
import { PassportModule } from '@nestjs/passport';
import { GoogleService } from 'src/services/google.services';

@Module({
  imports: [
    PassportModule,
    RedisModule,
    ConfigModule,
    JwtConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserEntity,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtUtilService,
    AuthGuard,
    MailService,
    OTPService,
    RateLimitService,
    GoogleService,
  ],
  exports: [AuthGuard, JwtUtilService],
})
export class AuthModule {}
