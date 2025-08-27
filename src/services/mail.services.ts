import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';
import { OTPService } from './otp.services';

@Injectable()
export class MailService {
  private transporter: nodeMailer.Transporter;

  constructor(
    private env: ConfigService,
    private otp: OTPService,
  ) {
    this.transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.env.get('MAIL_USER'),
        pass: this.env.get('MAIL_PASS'),
      },
    });
  }

  async sendVerifyEmail(email: string) {
    const mailOptions = {
      from: `Authentication-Nestjs`,
      to: email,
      subject: 'Verify Email',
      text: `Your OTP - ${await this.otp.generateOTP(email, 'VERIFY')}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendForgotPassword(email: string) {
    const mailOptions = {
      from: `Authentication-Nestjs`,
      to: email,
      subject: 'Forgot Password',
      text: `Your OTP - ${await this.otp.generateOTP(email, 'FORGOT')}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
