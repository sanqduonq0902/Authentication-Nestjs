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

@Module({
  imports: [
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
  providers: [AuthService, JwtUtilService, AuthGuard],
  exports: [AuthGuard, JwtUtilService],
})
export class AuthModule {}
