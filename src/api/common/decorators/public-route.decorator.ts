import { SetMetadata } from '@nestjs/common';
import { key } from 'src/api/common/enum';

export const Public = () =>
  SetMetadata(key.IS_PUBLIC, true);
