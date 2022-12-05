import * as config from 'config';

const CLIENT_CONFIG = config.get('CLIENT');

export const ClientConfig = {
  url: CLIENT_CONFIG.URL,
  successPay: CLIENT_CONFIG.SUCCESS,
  failPay: CLIENT_CONFIG.FAIL,
};
