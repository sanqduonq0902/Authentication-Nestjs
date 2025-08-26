import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { signUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';

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
}
