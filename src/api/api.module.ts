import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/modules/auth/auth.module';
import { UserModule } from 'src/api/modules/user/user.module';
import { PrismaModule } from 'src/api/modules/prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
})
export class ApiModule {}
