import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/api/common/dto';
// import { Public } from 'src/api/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
  ) {}
  // @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: Prisma.UserCreateInput) {
    return this._authService.signUp(dto);
  }
  // @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this._authService.signIn(dto);
  }
}
