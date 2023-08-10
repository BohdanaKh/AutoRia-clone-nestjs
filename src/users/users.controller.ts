import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { Action } from '../casl/action.enum';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policy.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { PublicUserData } from './interface/user.interface';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiExtraModels(PublicUserData, PaginatedDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard())
  @ApiPaginatedResponse('entities', User)
  @Get('list')
  async geAllUsers(@Query() query: PublicUserInfoDto) {
    return this.usersService.getAllUsers(query);
  }

  @Post('account/create')
  async createUserAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.usersService.createUser(body);
  }

  @Post('managers/account/create')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  async createManagerAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.usersService.createUser(body);
  }
  @Get(':userId')
  async getUserProfile(@Param('userId') id: string) {
    return this.usersService.getOneUser(id);
  }
  //
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Get('/admin')
  // getDashboard(@Request() req) {
  //   return req.user;
  // }
  @Delete(':userId')
  async deleteUserAccount(@Param('userId') userId: string) {
    return this.usersService.delete(userId);
  }

  @Patch(':userId')
  async update(@Param('userId') userId: string, @Body() body: UserUpdateDto) {
    return this.usersService.update(+userId, body);
  }
}