import { Role, User } from '@prisma/client';

export const isAdmin = (user: User) => {
  return user.roles.includes(Role.ADMIN);
};

export const isSuperAdmin = (user: User) => {
  console.log(user.roles);

  return user.roles.includes(Role.SUPERADMIN);
};

export const isUser = (user: User) => {
  return user.roles.includes(Role.USER);
};
