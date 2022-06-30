import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtProvider } from '../jwt/jwt.provider';
import { CryptoProvider } from './encrypt.provider';

@Module({
  providers: [JwtProvider, JwtService],
  exports: [CryptoProvider],
})
export class EncryptsModule {}
