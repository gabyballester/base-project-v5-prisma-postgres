// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Role } from '@prisma/client';
// import { Request } from 'express';
// import { Action, key } from 'src/api/common/enum';
// import { TokenProvider } from 'src/api/modules/providers/token.provider';
// import {
//   hasBearer,
//   isNotNull,
// } from '../functions';
// import { hasRole } from '../functions/role-check.function';
// import { JwtDecodeResponse } from '../interfaces';

// @Injectable()
// export class PermissionsGuard
//   implements CanActivate
// {
//   constructor(
//     private _reflector: Reflector,

//     private _tokenProvider: TokenProvider,
//   ) {}

//   async canActivate(
//     context: ExecutionContext,
//   ): Promise<any> {
//     const [requiredRoles, action] =
//       this._reflector.getAllAndOverride<any>(
//         key.permissions,
//         [
//           context.getHandler(),
//           context.getClass(),
//         ],
//       );

//     if (!requiredRoles) {
//       return true;
//     }

//     const request: Request = context
//       .switchToHttp()
//       .getRequest();

//     hasBearer(request);

//     const user =
//       this._tokenProvider.decodeToken(request);

//     isNotNull(user);

//     // if (hasRole(user, requiredRoles)) {
//     //   return true;
//     // } else {
//     //   switch (action) {
//     //     case Action.manage:
//     //       return true;
//     //     case Action.create:
//     //       break;
//     //     default:
//     //       break;
//     //   }
//     // }

//     // return user && user.roles && hasRole();
//     return false;
//   }
// }
