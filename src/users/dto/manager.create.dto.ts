import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import Role from '../enum/user.role.enum';
import { UserCreateDto } from './user.create.dto';

export class ManagerCreateDto extends UserCreateDto {
  @ApiProperty()
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role.Manager;
}
