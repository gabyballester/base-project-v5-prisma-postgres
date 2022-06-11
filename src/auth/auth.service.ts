import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { key } from 'src/common/enum';
import { getConst } from 'src/common/functions';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this._prismaService.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
        },
      });
      
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // duplicate code
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this._prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const jwtPayload = {
      sub: userId,
      email,
    };
    const secret = this._configService.get(key.JWT_SECRET);

    const [access_token, refresh_token] = await Promise.all([
      this._jwtService.signAsync(jwtPayload, {
        secret,
        expiresIn: getConst(key.AT_EXPIRATION),
      }),
      this._jwtService.signAsync(jwtPayload, {
        secret,
        expiresIn: getConst(key.RT_EXPIRATION),
      }),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
}
