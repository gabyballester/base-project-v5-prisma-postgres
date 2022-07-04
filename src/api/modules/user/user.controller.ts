import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
// import { Public } from 'src/api/common/decorators';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() dto: Prisma.UserUncheckedCreateInput,
  ) {
    return await this._userService.create(
      request,
      dto,
    );
  }

  // @Public()
  @Get()
  async findAll() {
    return await this._userService.findAll();
  }

  // @Public()
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
    @Req() request: Request,
    @Param('id')
    id: Prisma.UserWhereUniqueInput,
    @Body() dto: Prisma.UserUncheckedUpdateInput,
  ) {
    return await this._userService.update(
      request,
      id,
      dto,
    );
  }

  @Delete(':id')
  async remove(
    @Req() request: Request,
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    return await this._userService.remove(
      request,
      id,
    );
  }
}
