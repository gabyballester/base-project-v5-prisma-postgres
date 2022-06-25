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
import { Prisma, User } from '@prisma/client';
import {
  GetUser,
  Public,
} from 'src/common/decorators';
// import { UpdateUserDto } from 'src/common/dto/user/update-user.dto';
import { AbilityFactory } from 'src/ability/ability.factory';
import { Action, Entity } from 'src/common/enum';
import { ForbiddenError } from '@casl/ability';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _abilityFactory: AbilityFactory,
  ) {}

  // @Public()
  @Post()
  async create(
    @GetUser() user: User,
    @Body() dto: Prisma.UserUncheckedCreateInput,
  ) {
    const ability =
      this._abilityFactory.defineAbility(user);
    // OPTION 1
    // const isAllowed = ability.can(
    //   Action.CREATE,
    //   'User',
    // );
    // if (!isAllowed) {
    //   throw new ForbiddenException(
    //     'Only admin!!',
    //   );
    // }

    // OPTION 2
    try {
      ForbiddenError.from(ability).throwUnlessCan(
        Action.CREATE,
        Entity.USER,
      );
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(
          error.message,
        );
      }
    }
    return await this._userService.create(dto);
  }

  @Public()
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
