import { Role } from '@prisma/client';

export interface JwtDecodeResponse {
  sub: number;
  email: string;
  roles: Role[];
  iat: number;
  exp: number;
}
