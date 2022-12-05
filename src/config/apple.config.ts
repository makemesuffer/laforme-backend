import * as config from 'config';

const APPLE_CONFIG = config.get('APPLE');

export const AppleConfig = {
  clientID: APPLE_CONFIG.CLIENT_ID,
  teamID: APPLE_CONFIG.TEAM_ID,
  callbackURL: APPLE_CONFIG.CALLBACK_URL,
  keyID: APPLE_CONFIG.KEY_ID,
};
