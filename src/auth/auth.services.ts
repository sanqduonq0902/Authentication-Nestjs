import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { signUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dtos/login.dto';
import { changePasswordDto } from './dtos/change-password';
import { forgotPasswordDto } from './dtos/forgot-password';
import { MailService } from 'src/services/mail.services';
import { RateLimitService } from 'src/services/rate-limit.services';
import { verifyEmailDto } from './dtos/verify-emai';
import Redis from 'ioredis';
import { resendOTPDto } from './dtos/resend-OTP';
import { resetPasswordDto } from './dtos/reset-password';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private redis: Redis,
    @InjectModel(User.name) private UserModel: Model<User>,
    private mail: MailService,
    private rateLimit: RateLimitService,
  ) {}

  async signUp(dto: signUpDto) {
    const { email, name, password } = dto;

    const existingUser = await this.UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exist');
    }

    const saltNumber = 10;
    const hashing = await bcrypt.hash(password, saltNumber);

    const newUser = await this.UserModel.create({
      name,
      email,
      password: hashing,
      isVerify: false,
    });
    void this.mail.sendVerifyEmail(email);

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

  async verifyEmail(dto: verifyEmailDto) {
    const { email, otp } = dto;

    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const otpRedis = await this.redis.get(`VERIFY:${email}`);
    if (otp !== otpRedis) {
      throw new BadRequestException('OTP is wrong');
    }

    await this.UserModel.findOneAndUpdate(
      { email: email },
      { isVerify: true },
      { new: true },
    );

    await this.redis.del(`VERIFY:${email}`);
  }

  async resendOTP(dto: resendOTPDto) {
    const { email, type } = dto;

    const user = await this.UserModel.findOne({ email });
    if (user?.isVerify && type === 'VERIFY') {
      throw new BadRequestException('Email already verify');
    }

    await this.rateLimit.checkLimit(email, {
      limit: 3,
      ttl: 30,
    });

    await this.redis.del(`${type}:${email}`);

    if (type === 'VERIFY') {
      void this.mail.sendVerifyEmail(email);
    } else {
      void this.mail.sendForgotPassword(email);
    }
  }

  async changePassword(dto: changePasswordDto, userId: string | undefined) {
    const { currentPassword, newPassword } = dto;

    const user = await this.UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('Token not provided');
    }

    const comparing = await bcrypt.compare(currentPassword, user.password!);
    if (!comparing) {
      throw new UnauthorizedException('Current password is wrong');
    }

    const saltNumber = 10;
    const hashing = await bcrypt.hash(newPassword, saltNumber);
    await this.UserModel.findByIdAndUpdate(
      user._id,
      {
        password: hashing,
      },
      { new: true },
    );
  }

  async forgotPassword(dto: forgotPasswordDto) {
    const { email } = dto;

    await this.rateLimit.checkLimit(email, {
      limit: 3,
      ttl: 30,
    });

    const existingEmail = await this.UserModel.findOne({
      email,
    });
    if (!existingEmail) {
      throw new BadRequestException('Email is not found');
    }
    void this.mail.sendForgotPassword(email);
  }

  async resetPassword(dto: resetPasswordDto) {
    const { email, otp, newPassword } = dto;

    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const otpRedis = await this.redis.get(`FORGOT:${email}`);
    if (otp !== otpRedis) {
      throw new BadRequestException('OTP is wrong');
    }

    const saltNumber = 10;
    const hashing = await bcrypt.hash(newPassword, saltNumber);
    await this.UserModel.findOneAndUpdate(
      { email },
      { password: hashing },
      { new: true },
    );

    await this.redis.del(`FORGOT:${email}`);
  }
}
