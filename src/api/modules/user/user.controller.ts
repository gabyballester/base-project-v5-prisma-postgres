import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
import {
  GetUser,
  Public,
} from 'src/api/common/decorators';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Body() dto: Prisma.UserUncheckedCreateInput,
  ) {
    return await this._userService.create(dto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this._userService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    return await this._userService.findOne({
      id: +id,
    });
  }

  @Put(':id')
  async update(
    @GetUser() user: User,
    @Param('id')
    id: Prisma.UserWhereUniqueInput,
    @Body() dto: Prisma.UserUncheckedUpdateInput,
  ) {
    return await this._userService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    return await this._userService.remove(id);
  }
}
