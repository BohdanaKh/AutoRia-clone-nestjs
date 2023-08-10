import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// import Role from '../roles/user.role.enum';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  userName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city: string;
  //
  // @ApiProperty()
  // @IsEnum(Role)
  // roles: Role;
}
