import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { db } from 'src/api/common/enum';
import { getEnvConst } from 'src/api/common/functions';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApiModule,
  ],
})
export class AppModule {
  static port: number;
  static host: string;
  static version: string;

  constructor() {
    AppModule.port = parseInt(
      getEnvConst(db.SERVER_PORT),
    );
    AppModule.host = getEnvConst(db.SERVER_HOST);
    AppModule.version = getEnvConst(
      db.SERVER_VERSION,
    );
  }
}
