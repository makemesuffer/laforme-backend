import * as config from 'config';

const GOOGLE_CONFIG = config.get('GOOGLE');

export const GoogleConfig = {
  clientID: GOOGLE_CONFIG.CLIENT_ID,
  clientSecret: GOOGLE_CONFIG.CLIENT_SECRET,
  callbackURL: GOOGLE_CONFIG.CALLBACK_URL,
};
