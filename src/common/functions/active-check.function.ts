import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

export const isActive = (user: User) => {
  if (!user.active)
    throw new ForbiddenException(
      `Account not verified -> request password recovery on loggi's page`,
    );
};
