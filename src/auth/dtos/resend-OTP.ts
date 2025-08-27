import { IsEmail } from 'class-validator';

export class resendOTPDto {
  @IsEmail()
  email: string;
}
