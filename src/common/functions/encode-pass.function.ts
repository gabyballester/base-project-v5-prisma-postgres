import * as argon from 'argon2';

export const encodePass = async ({
  password,
}) => {
  return await argon.hash(password);
};
