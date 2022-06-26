import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';
import { key } from 'src/common/enum';

export const Permissions = (...roles: any) => {
  console.log(roles);
  return SetMetadata('roles', roles);
};
