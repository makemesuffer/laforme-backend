import * as config from 'config';
const DADATA_CONFIG = config.get('DADATA');

export const DadataConfig = {
  apiToken: DADATA_CONFIG.TOKEN,
};
