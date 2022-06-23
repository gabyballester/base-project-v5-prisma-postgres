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
import { Prisma } from '@prisma/client';
import { Public } from 'src/common/decorators';
import { UpdateUserDto } from 'src/common/dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {}

  @Public()
  @Post()
  async create(
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

  @Public()
  @Put(':id')
  async update(
    @Param('id')
    id: Prisma.UserWhereUniqueInput,
    @Body() dto: UpdateUserDto,
  ) {
    return await this._userService.update(
      id,
      dto,
    );
  }

  @Public()
  @Delete(':id')
  async remove(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    return await this._userService.remove(id);
  }
}
