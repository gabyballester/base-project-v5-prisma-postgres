import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:admin@localhost:5432/nestv5',
          // url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  // cleanDb() {
  //   return this.$transaction([this.role.deleteMany(), this.user.deleteMany()]);
  // }
}
