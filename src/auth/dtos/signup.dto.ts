import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class signUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must be at least one number' })
  password: string;
}
