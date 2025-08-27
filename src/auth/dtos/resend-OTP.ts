import { IsEmail, IsEnum } from 'class-validator';

export class resendOTPDto {
  @IsEmail()
  email: string;

  @IsEnum(['VERIFY', 'FORGOT'])
  type: 'VERIFY' | 'FORGOT';
}
