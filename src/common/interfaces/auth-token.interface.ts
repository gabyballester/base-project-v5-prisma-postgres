import { User } from '@prisma/client';

export interface IAuthToken {
  access_token: string;
  refresh_token: string;
  userData: User;
}
