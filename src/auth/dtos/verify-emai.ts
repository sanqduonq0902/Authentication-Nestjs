import { IsEmail, IsString } from 'class-validator';

export class verifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
