import * as config from 'config';

const MAIL_CONFIG = config.get('MAIL');

export const MailConfig = {
  email: MAIL_CONFIG.EMAIL,
  password: MAIL_CONFIG.PASSWORD,
  host: MAIL_CONFIG.HOST,
};
