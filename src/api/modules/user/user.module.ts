import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CryptoProvider } from '../providers/crypto.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, CryptoProvider],
})
export class UserModule {}
