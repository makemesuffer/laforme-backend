import * as config from 'config';

const PAY_ANY_WAY_CONFIG = config.get('PAY_ANY_WAY');

export const PayAnyWayConfig = {
  MNT_ID: PAY_ANY_WAY_CONFIG.MNT_ID,
  MNT_INTEGRITY_CODE: PAY_ANY_WAY_CONFIG.MNT_INTEGRITY_CODE,
  PAY_URL: PAY_ANY_WAY_CONFIG.PAY_URL,
};
