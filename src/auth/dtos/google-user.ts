import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class createUserGoogleDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  profilePicture: string;

  @IsBoolean()
  isVerify: boolean;

  @IsString()
  password: string;
}
