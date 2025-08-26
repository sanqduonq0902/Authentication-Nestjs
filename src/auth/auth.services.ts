import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { signUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async signUp(dto: signUpDto) {
    const { email, name, password } = dto;

    const existingUser = await this.UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already exist');
    }

    const saltNumber = 10;
    const hashing = await bcrypt.hash(password, saltNumber);

    const newUser = await this.UserModel.create({
      name,
      email,
      password: hashing,
    });

    return newUser;
  }

  async login(dto: loginDto) {
    const { email, password } = dto;
    const existingUser = await this.UserModel.findOne({ email });

    if (!existingUser) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    const comparing = await bcrypt.compare(password, existingUser.password!);
    if (!comparing) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    return {
      userId: String(existingUser._id),
    };
  }
}
