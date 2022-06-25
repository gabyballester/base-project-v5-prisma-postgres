import { Role, User } from '@prisma/client';

export const isAdmin = (user: User) => {
  return user.roles.includes(
    Role.ADMIN || Role.SUPERADMIN,
  );
};
