import { Module } from '@nestjs/common';

import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';

@Module({
  // imports: [UsersModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
