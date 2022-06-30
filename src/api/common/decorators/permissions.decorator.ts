import { SetMetadata } from '@nestjs/common';
import { key } from 'src/api/common/enum';

export const Permissions = (...roles: any) =>
  SetMetadata(key.roles, roles);
