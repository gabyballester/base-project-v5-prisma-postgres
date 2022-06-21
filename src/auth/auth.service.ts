import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { key } from 'src/common/enum';
import { SignInDto } from '../common/dto';
import { UserService } from '../user/user.service';
import {
  getEnvConst,
  verifyPass,
} from 'src/common/functions';
import { IAuthToken } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {}

  async signUp(
    dto: Prisma.UserCreateInput,
  ): Promise<IAuthToken> {
    if (
      await this._userService.findByEmail(
        dto.email,
      )
    ) {
      throw new BadRequestException(
        'Email taken',
      );
    }

    if (
      await this._userService.findByUsername(
        dto.username,
      )
    ) {
      throw new BadRequestException(
        'Username taken',
      );
    }

    const createdUser =
      await this._userService.saveUserOnDatabate(
        dto,
      );
    if (!createdUser)
      throw new BadRequestException(
        'User not created',
      );

    const isUser = await this.signToken(
      createdUser,
    );
    if (!isUser) {
      throw new BadRequestException(
        'User not created',
      );
    }
    return isUser;
  }
  async signIn(
    dto: SignInDto,
  ): Promise<IAuthToken> {
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

    const pwMatches = await verifyPass(
      user.password,
      dto.password,
    );

    if (!pwMatches)
      throw new ForbiddenException(
        'Password do not match',
      );
    return this.signToken(user);
  }

  async signToken(
    user: User,
  ): Promise<IAuthToken> {
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
          expiresIn: key.ACCESS_TOKEN_EXPIRATION,
        },
      );

    const refresh_token =
      await this._jwtService.signAsync(
        jwtPayload,
        {
          secret,
          expiresIn: key.REFRESH_TOKEN_EXPIRATION,
        },
      );

    return {
      access_token,
      refresh_token,
      userData: user,
    };
  }
}
