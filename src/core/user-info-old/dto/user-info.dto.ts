export interface UserInfoDto {
  fullName: string;
  phone: string;

  googleId: string;
  appleId: string;
  facebookId: string;

  country: {
    country: string;
    country_iso_code: string;
    label: string;
  };

  city: {
    city: string;
    fias_id: string;
    fias_level: string;
    kladr_id: string;
    label: string;
    settlement: string;
  };

  street: {
    fias_id: string;
    fias_level: string;
    label: string;
    street: string;
  };

  house: {
    fias_id: string;
    fias_level: string;
    house: string;
    label: string;
  };

  postal_code: {
    label: string;
    postal_code: string;
  };

  address: {
    country: string;
    city: string;
    settlement: string;
    street: string;
    house: string;
    postal_code: string;
    kladr_id: string;
  };
}
