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
import { key } from 'src/api/common/enum';
import {
  CryptoProvider,
  TokenProvider,
} from '../providers';
import { IAuthToken } from 'src/api/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _userService: UserService,
    private readonly _jwtProvider: TokenProvider,
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
        key.access_token,
        key.access_token_exp,
      );

    const refresh_token =
      await this._jwtProvider.createToken(
        user,
        key.refresh_token,
        key.refresh_token_exp,
      );

    return {
      access_token,
      refresh_token,
      user: user,
    };
  }
}
