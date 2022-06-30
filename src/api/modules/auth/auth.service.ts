import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/api/modules/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { SignInDto } from 'src/api/common/dto';
import { UserService } from '../user/user.service';
import {
  isActive,
  isBlocked,
} from 'src/api/common/functions';
import { CryptoProvider } from '../providers/encrypt/encrypt.provider';
import { JwtProvider } from '../providers/jwt/jwt.provider';
import { key } from 'src/api/common/enum';
import { IAuthToken } from '../../../../dist/api/common/interfaces/auth-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _userService: UserService,
    private readonly _jwtProvider: JwtProvider,
    private readonly _cryptoProvider: CryptoProvider,
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
    if (!createdUser) {
      throw new BadRequestException(
        'User not created',
      );
    }
    return await this.signToken(createdUser);
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

    user && isBlocked(user); //if user has been blocked
    user && isActive(user); // if user is still inactive
    this._cryptoProvider.verifyPass(
      dto.password,
      user.password,
    );

    return this.signToken(user);
  }

  async signToken(
    user: User,
  ): Promise<IAuthToken> {
    const access_token =
      await this._jwtProvider.createToken(
        user,
        key.ACCESS_TOKEN,
        key.ACCESS_TOKEN_EXPIRATION,
      );

    const refresh_token =
      await this._jwtProvider.createToken(
        user,
        key.REFRESH_TOKEN,
        key.REFRESH_TOKEN_EXPIRATION,
      );

    return {
      access_token,
      refresh_token,
      user: user,
    };
  }
}
