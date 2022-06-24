import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const hasBearer = (request: Request) => {
  const hasBearer =
    request.headers.authorization.split(
      'Bearer',
    )[1];

  if (hasBearer === undefined) {
    throw new UnauthorizedException(
      'Token not valid, loggin again',
    );
  }
};
