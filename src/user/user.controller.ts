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

  @Post()
  create(
    @Body() dto: Prisma.UserUncheckedCreateInput,
  ) {
    return this._userService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this._userService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    return this._userService.findOne({ id: +id });
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._userService.remove({ id: +id });
  }
}
