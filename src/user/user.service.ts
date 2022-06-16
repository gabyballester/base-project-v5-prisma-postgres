import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private _prismaService: PrismaService,
  ) {}

  async create(
    dto: Prisma.UserUncheckedCreateInput,
  ) {
    const emailExists = await this.findByEmail(
      dto.email,
    );

    if (emailExists)
      throw new BadRequestException(
        'Email taken',
      );

    const usernameExists =
      await this.findByUsername(dto.username);

    if (usernameExists)
      throw new BadRequestException(
        'Username taken',
      );

    return await this._prismaService.user.create({
      data: dto,
    });
  }

  async findByEmail(email: string) {
    const existing =
      await this._prismaService.user.findUnique({
        where: {
          email,
        },
      });
    return existing;
  }

  async findByUsername(username: string) {
    const existing =
      await this._prismaService.user.findUnique({
        where: {
          username,
        },
      });
    return existing;
  }

  findAll() {
    return this._prismaService.user.findMany();
  }

  findOne(id: Prisma.UserWhereUniqueInput) {
    return this._prismaService.user.findUnique({
      where: id,
    });
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

  remove(id: Prisma.UserWhereUniqueInput) {
    return this._prismaService.user.delete({
      where: id,
    });
  }
}
