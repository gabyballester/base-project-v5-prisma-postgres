import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { key } from 'src/common/enum';
import {
  createHash,
  getConst,
  verifyHash,
} from 'src/common/functions';
import { SignInDto } from './dto/signIn.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {}

  async signUp(dto: Prisma.UserCreateInput) {
    try {
      const emailExists =
        await this._userService.findByEmail(
          dto.email,
        );

      if (emailExists)
        throw new BadRequestException(
          'Email taken',
        );

      const usernameExists =
        await this._userService.findByUsername(
          dto.username,
        );

      if (usernameExists)
        throw new BadRequestException(
          'Username taken',
        );

      const user =
        await this._prismaService.user.create({
          data: {
            ...dto,
            password: await createHash(dto),
          },
        });

      if (!user) {
        throw new BadRequestException(
          'User not created',
        );
      }

      return this.signToken(user);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          // duplicate code
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    const user =
      await this._prismaService.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user)
      throw new ForbiddenException(
        'Email not found',
      );

    const pwMatches = await verifyHash(
      user.password,
      dto.password,
    );

    if (!pwMatches)
      throw new ForbiddenException(
        'Password do not match',
      );
    return this.signToken(user);
  }

  async signToken(user: User): Promise<{
    access_token: string;
    refresh_token: string;
    userData: User;
  }> {
    const { id, email, roles } = user;
    const jwtPayload = {
      sub: id,
      email,
      roles,
    };
    const secret = this._configService.get(
      key.JWT_SECRET,
    );

    const access_token =
      await this._jwtService.signAsync(
        jwtPayload,
        {
          secret,
          expiresIn: getConst(key.AT_EXPIRATION),
        },
      );

    const refresh_token =
      await this._jwtService.signAsync(
        jwtPayload,
        {
          secret,
          expiresIn: getConst(key.RT_EXPIRATION),
        },
      );

    return {
      access_token,
      refresh_token,
      userData: user,
    };
  }
}
