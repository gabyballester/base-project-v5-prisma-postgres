import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

export const isActive = (user: User) => {
  if (!user.active)
    throw new ForbiddenException(
      `Account not activated yet -> recover your password throug the login page`,
    );
};
