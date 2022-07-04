import { UnauthorizedException } from '@nestjs/common';

export const isNotNull = (
  prop: any,
  message = 'You must be logged in',
) => {
  if (prop === null) {
    throw new UnauthorizedException(message);
  }
};
