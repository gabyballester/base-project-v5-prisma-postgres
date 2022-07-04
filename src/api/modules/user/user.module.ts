import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { TokenProvider } from '../providers/token.provider';
import {
  CryptoProvider,
  PermissionProvider,
} from '../providers';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    CryptoProvider,
    JwtService,
    TokenProvider,
    PermissionProvider,
  ],
})
export class UserModule {}
