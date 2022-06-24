import { UnauthorizedException } from '@nestjs/common';

export const isNotNull = (prop: any) => {
  if (prop === null) {
    throw new UnauthorizedException(
      'You must be logged in (role checker)',
    );
  }
};
