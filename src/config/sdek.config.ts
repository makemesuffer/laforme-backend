import * as config from 'config';

const СDEK_CONFIG = config.get('СDEK');

export const SdekConfig = {
  grant_type: СDEK_CONFIG.GRANT_TYPE,
  clientID: СDEK_CONFIG.CLIENT_ID,
  testClientID: 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI',
  clientSecret: СDEK_CONFIG.CLIENT_SECRET,
  testClientSecret: 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG',
  from_location: {
    code: 137,
    city: 'Санкт-Петербург',
    address: '199106, Санкт-Петербург, ул. Новгородская, д.23, лит.А',
    postal_code: 230203,
  },
  weight: 300,
  height: 1,
  width: 30,
  length: 40,
};
