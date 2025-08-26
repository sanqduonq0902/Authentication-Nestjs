import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './entities/user.entity';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserEntity,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
