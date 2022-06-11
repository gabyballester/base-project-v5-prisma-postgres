import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { db } from 'src/common/enum';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get(db.DATABASE_URL),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([this.role.deleteMany(), this.user.deleteMany()]);
  }
}
