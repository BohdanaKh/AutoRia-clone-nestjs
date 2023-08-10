import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Advert } from '../../advert/advert.entity';
import { User } from '../../users/user.entity';
import { Action } from '../action.enum';

type Subjects = InferSubjects<typeof Advert | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === 'Admin') {
      can(Action.Manage, 'all'); // read-write access to everything
    } else if (user.role === 'Manager') {
      can(Action.Manage, 'all'); // read-write access to everything
    } else if (user.role === 'User') {
      can(Action.Create && Action.Update, Advert && User); // create, update access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, Advert, {});
    cannot(Action.Delete, Advert, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
