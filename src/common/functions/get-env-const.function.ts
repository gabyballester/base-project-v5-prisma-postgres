import { ConfigService } from '@nestjs/config';

export const getEnvConst = (v: string) => {
  const cf: ConfigService = new ConfigService();
  return cf.get<string>(v);
};
