import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UsersRepository } from '../../users/users.repository';

export const IsPremium = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user_id;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userRepository = new UsersRepository();
    const user = await userRepository.findOneBy({ id: userId });

    return user.isPremium;
  },
);
