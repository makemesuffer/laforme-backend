export class UserGetInfoDto {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    value: string;
    unrestricted_value: object;
  };
}
