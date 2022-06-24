import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { AbilityAction } from 'src/common/enum';
import { UserEntity } from 'src/user/user.entity';
import { ForbiddenError } from '@casl/ability';

export type Subjects =
  | InferSubjects<typeof UserEntity>
  | 'all';

export type AppAbility = Ability<
  [AbilityAction, Subjects]
>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User, message: string) {
    const { can, cannot, build } =
      new AbilityBuilder(
        Ability as AbilityClass<AppAbility>,
      );

    if (
      user.roles.includes(
        Role.ADMIN || Role.SUPERADMIN,
      )
    ) {
      can(AbilityAction.MANAGE, 'all');
      // can(AbilityAction.UPDATE, UserEntity, {
      //   id: { $ne: user.id },
      // }).because(
      //   'You can only manage your own user',
      // );
    } else {
      can(AbilityAction.READ, UserEntity);
      cannot(
        AbilityAction.CREATE,
        UserEntity,
      ).because(message);
      // cannot(AbilityAction.CREATE, 'all').because(
      //   'Only admin role can create!!',
      // );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  checkAbility({ entity, entityType, message }) {
    const ability = this.defineAbility(
      entity,
      message,
    );
    // OPTION 1
    try {
      ForbiddenError.from(ability).throwUnlessCan(
        AbilityAction.CREATE,
        entityType,
      );
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(
          error.message,
        );
      }
    }

    // OPTION 2
    // const isAllowed = ability.can(
    //   AbilityAction.CREATE,
    //   entityType,
    // );
    // if (!isAllowed) {
    //   throw new ForbiddenException(
    //     'Only admin!!',
    //   );
    // }
  }
}
