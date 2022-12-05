import { USER_ROLE } from '../../user/enum/user-role.enum';

export interface JwtPayload {
  id: number;
  login: string;
  email: string;
  emailConfirmed: boolean;
  notificationEmail: boolean;
  role: USER_ROLE;
}
