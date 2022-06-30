import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

export const isBlocked = (user: User) => {
  if (user.blocked)
    throw new ForbiddenException(
      `You've been blocked, contact the admin`,
    );
};
