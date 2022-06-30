import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { key } from 'src/api/common/enum';
import { PrismaService } from '../../prisma/prisma.service';
import { getEnvConst } from 'src/api/common/functions';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  getEnvConst(key.jwt),
) {
  constructor(
    _configService: ConfigService,
    private _prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get(
        key.jwt_secret,
      ),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }): Promise<Omit<User, 'password'>> {
    const user =
      await this._prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
