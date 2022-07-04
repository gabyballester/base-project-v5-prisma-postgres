import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/api/modules/prisma/prisma.module';
import { UserService } from 'src/api/modules/user/user.service';
import {
  CryptoProvider,
  PermissionProvider,
  TokenProvider,
} from '../providers';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    TokenProvider,
    CryptoProvider,
    PermissionProvider,
  ],
})
export class AuthModule {}
