import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';
import { Roles } from './roles.decorator';

@UseGuards(JwtAuthGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {}

  @Post()
  create(
    @Body() dto: Prisma.UserUncheckedCreateInput,
  ) {
    try {
      return this._userService.create(dto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'This email is already registered',
        );
      }
      throw new InternalServerErrorException(
        'server error',
      );
    }
  }

  @Get()
  findAll() {
    return this._userService.findAll();
  }

  @Get(':id')
  findOne(
    @GetUser('id')
    userId: Prisma.UserWhereUniqueInput,
  ) {
    return this._userService.findOne({
      id: +userId,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Prisma.UserUpdateInput,
  ) {
    return this._userService.update(
      { id: +id },
      dto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._userService.remove({ id: +id });
  }
}
