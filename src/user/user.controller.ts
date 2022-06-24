import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import {
  GetUser,
  Public,
} from 'src/common/decorators';
import { UpdateUserDto } from 'src/common/dto/user/update-user.dto';
import { AbilityFactory } from '../ability/ability.factory';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _abilityFactory: AbilityFactory,
  ) {}

  // @Public()
  @Post()
  async create(
    @GetUser() user: UserEntity,
    @Body() dto: Prisma.UserUncheckedCreateInput,
  ) {
    this._abilityFactory.checkAbility({
      entity: user,
      entityType: UserEntity,
      message: `Only admins can create!!`,
    });
    return await this._userService.create(dto);
  }

  @Get()
  async findAll() {
    return await this._userService.findAll();
  }

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
  async remove(
    @Param('id') id: Prisma.UserWhereUniqueInput,
  ) {
    return await this._userService.remove(id);
  }
}
