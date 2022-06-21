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
import { key } from 'src/common/enum';
import { PrismaService } from '../../prisma/prisma.service';
import { getEnvConst } from 'src/common/functions';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  getEnvConst(key.JWT),
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
        key.JWT_SECRET,
      ),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user =
      await this._prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
    if (!user) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restUser } = user;

    return restUser;
  }
}
