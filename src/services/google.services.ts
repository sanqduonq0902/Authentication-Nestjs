import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.services';
import { IProfileGoogle } from 'src/interface/google';

@Injectable()
export class GoogleService extends PassportStrategy(Strategy) {
  constructor(
    public env: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: env.get('GOOGLE_CLIENT_ID')!,
      clientSecret: env.get('GOOGLE_CLIENT_SECRET')!,
      callbackURL: env.get('CALLBACK_GOOGLE'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: IProfileGoogle,
  ) {
    const { displayName, emails, photos } = profile;
    const user = await this.authService.validateGoogleUser({
      email: emails[0].value,
      name: displayName,
      profilePicture: photos[0].value,
      isVerify: true,
      password: '',
    });

    return user;
  }
}
