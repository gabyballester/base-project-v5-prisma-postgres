import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { key } from '../enum';

export const Roles = (...roles: Role[]) =>
  SetMetadata(key.ROLES, roles);
