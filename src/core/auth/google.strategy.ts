import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { GoogleConfig } from 'src/config/google.config';
import { GoogleUserData } from 'src/core/auth/interface/google-user-data';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: GoogleConfig.clientID,
      clientSecret: GoogleConfig.clientSecret,
      callbackURL: GoogleConfig.callbackURL,
      scope: ['email', 'profile'],
      prompt: 'consent',
      display: 'page',
    });
  }

  async validate(
    accessToken: string,
    refreshToken,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    const { id, emails } = profile;

    const user: GoogleUserData = {
      id: id,
      email: emails[0].value,
      accessToken,
    };

    cb(null, user);
  }
}
