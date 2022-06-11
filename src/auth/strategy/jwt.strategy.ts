import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { key } from 'src/common/enum';
import { PrismaService } from '../../prisma/prisma.service';
import { getConst } from '../../common/functions/index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, getConst(key.JWT)) {
  constructor(
    _configService: ConfigService,
    private _prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get(key.JWT_SECRET),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this._prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;
    return user;
  }
}
