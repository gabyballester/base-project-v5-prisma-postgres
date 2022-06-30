import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { key } from 'src/api/common/enum';

export const Permissions = (...roles: any) =>
  SetMetadata('roles', roles);
