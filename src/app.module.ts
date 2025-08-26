import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.modules';
import { EnvModule } from './config/env.config';
import { MongoDBModule } from './config/mongo.config';
import { RedisModule } from './config/redis.config';

@Module({
  imports: [EnvModule, MongoDBModule, RedisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
