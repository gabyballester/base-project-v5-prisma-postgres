import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { key } from '../common/enum/index';
import { JwtDecodeResponse } from './jwt-decode.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    const requiredRoles =
      this._reflector.getAllAndOverride<Role[]>(
        key.ROLES,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles) {
      return true;
    }

    const request: Request = context
      .switchToHttp()
      .getRequest();
    const user = (await this._jwtService.decode(
      request.headers.authorization
        ?.split('Bearer')[1]
        .trim() as string,
    )) as JwtDecodeResponse;

    if (!user.roles) {
      throw new UnauthorizedException();
    }

    const hasRole = () =>
      user.roles.some((role: Role) =>
        requiredRoles.includes(role),
      );

    if (!hasRole())
      throw new ForbiddenException(
        'Role not allowed',
      );

    return user && user.roles && hasRole();
  }
}
