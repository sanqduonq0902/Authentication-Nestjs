import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OTPService {
  @Inject('REDIS_CLIENT') private redis: Redis;

  async generateOTP(email: string) {
    const otp: string = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.redis.set(`mail:${email}`, otp, 'EX', 900);
    return otp;
  }
}
