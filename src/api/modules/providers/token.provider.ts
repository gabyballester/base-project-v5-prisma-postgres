import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ITokenPayload } from 'src/api/common/interfaces';
import { key } from '../../common/enum';

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
}
