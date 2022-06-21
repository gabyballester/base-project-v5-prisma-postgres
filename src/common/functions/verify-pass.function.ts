import * as argon from 'argon2';

export const verifyPass = async (
  userPass: string,
  dtoPass: string,
) => {
  return await argon.verify(userPass, dtoPass);
};
