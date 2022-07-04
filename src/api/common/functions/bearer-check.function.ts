import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const hasBearer = (request: Request) => {
  if (
    request.headers.authorization.split(
      'Bearer',
    )[1] === undefined
  ) {
    throw new UnauthorizedException(
      'Session has expired, try to login again',
    );
  }
};
