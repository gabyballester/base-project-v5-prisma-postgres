import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';

export const pwMatchesVerify = async (
  userPass: string,
  dtoPass: string,
) => {
  const pwMatches = await argon.verify(
    dtoPass,
    userPass,
  );

  if (!pwMatches)
    throw new ForbiddenException(
      'Password do not match',
    );

  return pwMatches;
};
