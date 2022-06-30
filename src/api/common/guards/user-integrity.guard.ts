import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { key } from 'src/api/common/enum';
import { JwtDecodeResponse } from '../interfaces';
import { UserService } from '../../modules/user/user.service';
import {
  hasBearer,
  isActive,
  isBlocked,
  isNotNull,
} from '../functions';

@Injectable()
export class UserIntegrityGuard
  implements CanActivate
{
  constructor(
    private readonly _reflector: Reflector,
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    const isPublic =
      this._reflector.getAllAndOverride<any>(
        key.is_public,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );
    if (isPublic) {
      return true;
    }

    const request: Request = context
      .switchToHttp()
      .getRequest();

    hasBearer(request);

    const user = (await this._jwtService.decode(
      request.headers.authorization
        ?.split('Bearer')[1]
        .trim() as string,
    )) as JwtDecodeResponse;

    isNotNull(user);

    const userFound =
      await this._userService.findOne({
        id: +user.sub,
      });

    isBlocked(userFound);

    isActive(userFound);

    return true;
  }
}
