import * as config from 'config';

const FACEBOOK_CONFIG = config.get('FACEBOOK');

export const FaceBookConfig = {
  clientID: FACEBOOK_CONFIG.CLIENT_ID,
  clientSecret: FACEBOOK_CONFIG.CLIENT_SECRET,
  callbackURL: FACEBOOK_CONFIG.CALLBACK_URL,
};
