import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory, UserService],
  exports: [AbilityFactory],
})
export class AbilityModule {}
