import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/modules/auth/auth.module';
import { UserModule } from 'src/api/modules/user/user.module';
import { PrismaModule } from 'src/api/modules/prisma/prisma.module';
import { JwtModule } from './modules/providers/jwt/jwt.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule,
  ],
})
export class ApiModule {}
