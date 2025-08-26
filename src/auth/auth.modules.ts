import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './entities/user.entity';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.services';
import { JwtUtilService } from 'src/utils/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/config/redis.config';

@Module({
  imports: [
    RedisModule,
    ConfigModule,
    JwtModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserEntity,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtUtilService],
})
export class AuthModule {}
