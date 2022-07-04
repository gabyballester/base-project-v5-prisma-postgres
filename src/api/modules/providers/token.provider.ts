import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  ITokenPayload,
  JwtDecodeResponse,
} from 'src/api/common/interfaces';
import { key } from '../../common/enum';
import { Request } from 'express';
import { hasBearer } from 'src/api/common/functions';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  createToken(
    user: User,
    type: string,
    expiration: string,
  ): Promise<string> {
    const { jwtPayload, secret } =
      this.getTokenConfig(user, type);
    return this.encodeToken(
      jwtPayload,
      secret,
      expiration,
    );
  }

  getTokenConfig(
    user: User,
    type: string,
  ): {
    jwtPayload: ITokenPayload;
    secret: any;
  } {
    let jwtPayload: ITokenPayload;
    switch (type) {
      case key.refresh_token:
        jwtPayload = {
          sub: user.id,
        };
        break;
      default:
        jwtPayload = {
          sub: user.id,
          email: user.email,
          roles: user.roles,
        };
        break;
    }

    const secret = this._configService.get(
      key.jwt_secret,
    );

    return { jwtPayload, secret };
  }

  async encodeToken(
    jwtPayload: ITokenPayload,
    secret: string,
    expiration: string,
  ): Promise<string> {
    return await this._jwtService.signAsync(
      jwtPayload,
      {
        secret,
        expiresIn: expiration,
      },
    );
  }

  decodeToken(request: Request) {
    hasBearer(request);
    return this._jwtService.decode(
      request.headers.authorization
        ?.split('Bearer')[1]
        .trim() as string,
    ) as JwtDecodeResponse;
  }
}
