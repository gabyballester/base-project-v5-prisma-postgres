import { SetMetadata } from '@nestjs/common';
import { key } from 'src/common/enum';

export const Public = () =>
  SetMetadata(key.IS_PUBLIC, true);
