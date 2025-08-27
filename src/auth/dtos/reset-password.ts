import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class resetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must be at least one number' })
  newPassword: string;
}
