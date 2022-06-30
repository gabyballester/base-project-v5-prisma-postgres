import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const hasBearer = (request: Request) => {
  if (
    request.headers.authorization.split(
      'Bearer',
    )[1] === undefined
  ) {
    throw new UnauthorizedException(
      'Token not valid, try to login again',
    );
  }
};
