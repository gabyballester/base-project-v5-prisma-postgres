import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

export const isActive = (user: User) => {
  if (!user.active)
    throw new ForbiddenException(
      'New account, activate before login or request a password recovery',
    );
};
