import { Role } from '@prisma/client';

export interface ITokenPayload {
  sub: number;
  email?: string;
  roles?: Role[];
}
