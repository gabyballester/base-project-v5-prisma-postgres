import { Role } from '@prisma/client';

export class UserEntity {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  hash?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  active?: boolean;
  blocked?: boolean;
  roles?: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}
