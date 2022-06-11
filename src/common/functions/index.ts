import { ConfigService } from '@nestjs/config';

export const getConst = (v: string) => {
  console.log(v);

  const cf: ConfigService = new ConfigService();
  return cf.get<string>(v);
};
