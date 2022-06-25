import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import {
  PrismaAbility,
  Subjects,
} from '@casl/prisma';
import { User } from '@prisma/client';
import { Action, Entity } from 'src/common/enum';
import { isAdmin } from 'src/common/functions';

type AppSubjects = Subjects<{
  User: User;
}>;

export type AppAbility = Ability<
  [Action, AppSubjects]
>;
@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const AppAbility =
      PrismaAbility as AbilityClass<AppAbility>;
    const { can, cannot, build } =
      new AbilityBuilder(AppAbility);

    if (isAdmin(user)) {
      can(Action.MANAGE, Entity.USER);
    }

    if (!isAdmin(user)) {
      can(Action.READ, Entity.USER);
      cannot(Action.CREATE, Entity.USER).because(
        'Special message: Only admin!!',
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<AppSubjects>,
    });
  }
}

// ability.can('read', subject('User', { title: '...', authorId: 1 })));

// import {
//   Ability,
//   InferSubjects,
// } from '@casl/ability';
// import { Injectable } from '@nestjs/common';
// import { Action } from 'src/common/enum';
// import { UserEntity } from 'src/user/user.entity';

// export type Subjects =
//   | InferSubjects<typeof UserEntity>
//   | 'all';

// export type AppAbility = Ability<
//   [Action, Subjects]
// >;

// @Injectable()
// export class AbilityFactory {
// checkAbility({
//   entity,
//   entityType,
//   message,
//   dbUser,
// }) {
//   const ability = this.defineAbility(
//     entity,
//     message,
//     dbUser,
//   );
// OPTION 1
//   try {
//     ForbiddenError.from(ability).throwUnlessCan(
//       Action.CREATE,
//       entityType,
//     );
//   } catch (error) {
//     if (error instanceof ForbiddenError) {
//       throw new ForbiddenException(
//         error.message,
//       );
//     }
//   }
// OPTION 2
// const isAllowed = ability.can(
//   Action.CREATE,
//   entityType,
// );
// if (!isAllowed) {
//   throw new ForbiddenException(
//     'Only admin!!',
//   );
// }
// }
// defineAbility(
//   user: User,
//   message: string,
//   dbUser: User,
// ) {
//   console.log(user.id);
//   console.log(dbUser.id);
//   const { can, cannot, build } =
//     new AbilityBuilder(
//       Ability as AbilityClass<AppAbility>,
//     );
//   if (
//     user.roles.includes(
//       Role.ADMIN || Role.SUPERADMIN,
//     )
//   ) {
//     can(Action.MANAGE, 'all');
//   } else {
//     cannot(
//       Action.CREATE,
//       UserEntity,
//     ).because(message);
//   }
//   return build({
//     detectSubjectType: (item) =>
//       item.constructor as ExtractSubjectType<Subjects>,
//   });
// }
// }
