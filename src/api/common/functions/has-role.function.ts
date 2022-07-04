// import { UnauthorizedException } from '@nestjs/common';
// import { Role, User } from '@prisma/client';

// export const hasRole = async (
//   user: User,
//   requiredRoles: Role[],
// ) => {
//   return user.roles.forEach((role: Role) => {
//     if (!requiredRoles.includes(role)) {
//       throw new UnauthorizedException(
//         'Role not allowed',
//       );
//     }
//   });
// };
