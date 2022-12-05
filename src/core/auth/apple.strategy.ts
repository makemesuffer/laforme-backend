import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from '@nicokaiser/passport-apple';
import { AppleConfig } from 'src/config/apple.config';
import * as path from 'path';
import * as fs from 'fs';
import { AppleUserData } from 'src/core/auth/interface/apple-user-data';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: AppleConfig.clientID,
      teamID: AppleConfig.teamID,
      keyID: AppleConfig.keyID,
      callbackURL: AppleConfig.callbackURL,
      key: fs.readFileSync(path.join(__dirname, '../../../config/AuthKey.p8')),
      passReqToCallback: false,
      scope: ['name', 'email'],
    });
  }
  async validate(
    accessToken,
    refreshToken,
    profile: Profile,
    cb,
  ): Promise<any> {
    const user: AppleUserData = {
      id: profile.id,
      email: profile.email,
      emailVerified: profile.emailVerified,
    };
    cb(null, user);
  }
}
