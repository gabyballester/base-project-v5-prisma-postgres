import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Prisma,
  Role,
  User,
} from '@prisma/client';
import { Request } from 'express';
import {
  isActive,
  isAdmin,
  isBlocked,
  isNotNull,
  isSuperAdmin,
} from 'src/api/common/functions';
import { UserService } from '../../user/user.service';
import { TokenProvider } from '../token.provider';
import {
  Action,
  Entity,
} from 'src/api/common/enum';
import { isUser } from '../../../common/functions/role-check.function';
import { permConfig } from './entity.permissions';

interface IPermObj {
  entity: string;
  role: string;
  action: Action;
}

interface IRespObj {
  status: boolean;
  message: string;
}

@Injectable()
export class PermissionProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    private readonly _tokenProvider: TokenProvider,
  ) {}

  async getDBUserFromToken(request: Request) {
    const decodedUser =
      this._tokenProvider.decodeToken(request);
    isNotNull(decodedUser);
    const userFound =
      await this._userService.findOne({
        id: +decodedUser.sub,
      });
    isBlocked(userFound);
    isActive(userFound);
    return userFound;
  }

  async updateDeleteUser(
    id: Prisma.UserWhereUniqueInput,
    dbUser: User,
    entity: string,
    respObj: IRespObj,
    action: Action,
  ) {
    if (entity === Entity.user) {
      if (id === dbUser.id.toString()) {
        respObj.status = true;
        respObj.message = 'Permission granted';
        return respObj;
      } else {
        if (Action.update === action) {
          respObj.message =
            'You can only edit your own user';
        } else if (Action.delete === action) {
          respObj.message =
            'You can only delete your own user';
        }
        return respObj;
      }
    }
  }

  async getEntityPermission(
    permObj: IPermObj,
    id: Prisma.UserWhereUniqueInput,
    dbUser: User,
  ) {
    const { entity, role, action } = permObj;

    const respObj: IRespObj = {
      status: false,
      message: undefined,
    };

    const permission =
      permConfig[entity][
        role.toLocaleLowerCase()
      ];

    const canManage = permission.manage;
    let canDoAll = undefined;
    let canDoOwn = undefined;

    if (canManage) {
      respObj.status = true;
      respObj.message = 'Permission granted';
      return respObj;
    } else {
      canDoAll =
        permConfig[entity][
          role.toLocaleLowerCase()
        ][action].all;
    }

    if (!canManage && canDoAll) {
      respObj.status = true;
      respObj.message = 'Permission granted';
      return respObj;
    } else {
      canDoOwn =
        permConfig[entity][
          role.toLocaleLowerCase()
        ][action].own;
    }

    if (!canManage && !canDoAll && canDoOwn) {
      return await this.updateDeleteUser(
        id,
        dbUser,
        entity,
        respObj,
        action,
      );
    }

    if (!canManage && !canDoAll && !canDoOwn) {
      switch (action) {
        case Action.create:
          respObj.message =
            'No permission to create';
          return respObj;
        case Action.read:
          respObj.message =
            'No permission to read';
          return respObj;
        case Action.update:
          respObj.message =
            'No permission to update';
          return respObj;
        case Action.delete:
          respObj.message =
            'No permission to delete';
          return respObj;
      }
    }
  }

  async checkPermission(
    request: Request,
    action: Action,
    entity: string,
    id: Prisma.UserWhereUniqueInput = undefined,
  ) {
    const dbUser = await this.getDBUserFromToken(
      request,
    );

    let permObj: IPermObj = {
      entity: undefined,
      role: undefined,
      action: undefined,
    };

    if (isSuperAdmin(dbUser)) {
      permObj = {
        entity,
        role: Role.SUPERADMIN.toLocaleLowerCase(),
        action,
      };
    } else if (isAdmin(dbUser)) {
      permObj = {
        entity,
        role: Role.ADMIN.toLocaleLowerCase(),
        action,
      };
    } else if (isUser(dbUser)) {
      permObj = {
        entity,
        role: Role.USER.toLocaleLowerCase(),
        action,
      };
    }

    const permResult =
      await this.getEntityPermission(
        permObj,
        id,
        dbUser,
      );
    if (!permResult.status) {
      throw new UnauthorizedException(
        permResult.message,
      );
    }
    return true;
  }
}
