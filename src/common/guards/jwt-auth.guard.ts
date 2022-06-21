import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { key } from 'src/common/enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  key.JWT,
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic =
      this.reflector.getAllAndOverride<any>(
        key.IS_PUBLIC,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
