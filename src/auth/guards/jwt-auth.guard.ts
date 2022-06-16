import { AuthGuard } from '@nestjs/passport';
import { key } from 'src/common/enum';
import { getConst } from '../../common/functions/index';

export class JwtAuthGuard extends AuthGuard(
  getConst(key.JWT),
) {
  constructor() {
    super();
  }
}
