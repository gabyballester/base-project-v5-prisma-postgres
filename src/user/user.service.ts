import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Role } from 'src/common/enum';
import {
  encodePass,
  generateHash,
} from 'src/common/functions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private _prismaService: PrismaService,
  ) {}

  async saveUserOnDatabate(
    dto: Prisma.UserUncheckedCreateInput,
  ) {
    return await this._prismaService.user.create({
      data: {
        ...dto,
        password: await encodePass(dto),
        roles: dto.roles
          ? dto.roles
          : [Role.USER],
        hash: generateHash(),
      },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<User> {
    const isUser =
      await this._prismaService.user.findUnique({
        where: {
          email,
        },
      });
    return isUser;
  }

  async findByUsername(username: string) {
    const isUser =
      await this._prismaService.user.findUnique({
        where: {
          username,
        },
      });
    return isUser;
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
      this.saveUserOnDatabate(dto);
    if (!createdUser)
      throw new BadRequestException(
        'User not created',
      );
    return createdUser;
  }

  findAll() {
    return this._prismaService.user.findMany();
  }

  async findOne(
    id: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const isUser =
      await this._prismaService.user.findUnique({
        where: id,
      });
    if (!isUser) {
      throw new BadRequestException(
        'User does not exist',
      );
    }
    return isUser;
  }

  update(
    id: Prisma.UserWhereUniqueInput,
    dto: Prisma.UserUpdateInput,
  ) {
    return this._prismaService.user.update({
      where: id,
      data: dto,
    });
  }

  async remove(id: Prisma.UserWhereUniqueInput) {
    await this.findOne(id);

    return this._prismaService.user.delete({
      where: id,
    });
  }
}
