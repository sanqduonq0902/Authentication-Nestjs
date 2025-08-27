import { IsString, Matches, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must be at least one number' })
  newPassword: string;
}
