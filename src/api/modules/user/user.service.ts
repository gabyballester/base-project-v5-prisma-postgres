import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  Prisma,
  Role,
  User,
} from '@prisma/client';

import { PrismaService } from 'src/api/modules/prisma/prisma.service';
import { CryptoProvider } from '../providers/encrypt/encrypt.provider';

@Injectable()
export class UserService {
  constructor(
    private _prismaService: PrismaService,
    private _cryptoProvider: CryptoProvider,
  ) {}

  async saveUserOnDatabate(
    dto: Prisma.UserUncheckedCreateInput,
  ): Promise<User> {
    return await this._prismaService.user.create({
      data: {
        ...dto,
        password:
          await this._cryptoProvider.encodePass(
            dto,
          ),
        roles: dto.roles
          ? dto.roles
          : [Role.USER],
        hash: this._cryptoProvider.generateHash(),
      },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<User> {
    return await this._prismaService.user.findUnique(
      {
        where: {
          email,
        },
      },
    );
  }

  async findByUsername(
    username: string,
  ): Promise<User> {
    return await this._prismaService.user.findUnique(
      {
        where: {
          username,
        },
      },
    );
  }

  async create(
    dto: Prisma.UserUncheckedCreateInput,
  ): Promise<User> {
    if (await this.findByEmail(dto.email)) {
      throw new BadRequestException(
        'Email taken',
      );
    }

    if (await this.findByUsername(dto.username)) {
      throw new BadRequestException(
        'Username taken',
      );
    }

    const createdUser =
      await this.saveUserOnDatabate(dto);

    if (!createdUser)
      throw new BadRequestException(
        'User not created',
      );

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this._prismaService.user.findMany();
  }

  async findOne(
    id: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user =
      await this._prismaService.user.findUnique({
        where: id,
      });

    if (!user) {
      throw new BadRequestException(
        'User does not exist',
      );
    }
    return user;
  }

  async update(
    id: Prisma.UserWhereUniqueInput,
    dto: Prisma.UserUncheckedUpdateInput,
  ): Promise<{
    message: string;
    data: User;
  }> {
    await this.findOne({
      id: +id,
    });

    if (
      await this.findByEmail(dto.email.toString())
    ) {
      throw new BadRequestException(
        'Email taken',
      );
    }

    if (
      await this.findByUsername(
        dto.username.toString(),
      )
    ) {
      throw new BadRequestException(
        'Username taken',
      );
    }

    const userUpdated =
      await this._prismaService.user.update({
        where: { id: +id },
        data: dto,
      });

    if (!userUpdated) {
      throw new BadRequestException(
        'User not updated',
      );
    }

    return {
      message: 'User updated',
      data: userUpdated,
    };
  }

  async remove(
    id: Prisma.UserWhereUniqueInput,
  ): Promise<{
    message: string;
    data: User;
  }> {
    await this.findOne({
      id: +id,
    });

    const userDeleted =
      await this._prismaService.user.delete({
        where: { id: +id },
      });

    return {
      message: 'User deleted',
      data: userDeleted,
    };
  }
}
