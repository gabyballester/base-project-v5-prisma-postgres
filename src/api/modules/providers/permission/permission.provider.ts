import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import {
  isActive,
  isAdmin,
  isBlocked,
  isNotNull,
  isSuperAdmin,
} from 'src/api/common/functions';
// import { hasRole } from 'src/api/common/functions/has-role.function';
import { UserService } from '../../user/user.service';
import { TokenProvider } from '../token.provider';
import { Action, key } from 'src/api/common/enum';
import { isUser } from '../../../common/functions/role-check.function';
import { permConfig } from './entity.permissions';

interface IPermObj {
  entity: string;
  role: string;
  action: Action;
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

  getEntityPermission(permObj: IPermObj) {
    const { entity, role, action } = permObj;
    console.log(role);

    const all =
      permConfig[entity][role.toLocaleLowerCase()]
        .any;

    const currentAction =
      permConfig[entity][
        role.toLocaleLowerCase()
      ][action];

    if (all) {
      return true;
    } else if (currentAction) {
      return true;
    } else {
      return false;
    }
  }

  async checkPermission(
    request: Request,
    action: Action,
    entity: string,
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
      console.log('entra en isSuperAdmin');
      permObj = {
        entity,
        role: Role.SUPERADMIN.toLocaleLowerCase(),
        action,
      };
    } else if (isAdmin(dbUser)) {
      console.log('entra en isAdmin');

      permObj = {
        entity,
        role: Role.ADMIN.toLocaleLowerCase(),
        action,
      };
    } else if (isUser(dbUser)) {
      console.log('entra en isUser');
      permObj = {
        entity,
        role: Role.USER.toLocaleLowerCase(),
        action,
      };
    }
    return this.getEntityPermission(permObj);
  }
}
