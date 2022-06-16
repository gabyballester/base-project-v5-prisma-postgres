import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

export const getConst = (v: string) => {
  const cf: ConfigService = new ConfigService();
  return cf.get<string>(v);
};

export const createHash = async ({
  password,
}) => {
  return await argon.hash(password);
};

export const verifyHash = async (
  userPass: string,
  dtoPass: string,
) => {
  return await argon.verify(userPass, dtoPass);
};
