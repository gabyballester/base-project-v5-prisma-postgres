import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/api/modules/prisma/prisma.module';
import { UserService } from 'src/api/modules/user/user.service';
import { CryptoProvider } from '../providers/encrypt/encrypt.provider';
import { JwtProvider } from '../providers/jwt/jwt.provider';
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
    JwtProvider,
    CryptoProvider,
  ],
})
export class AuthModule {}
