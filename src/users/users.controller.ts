import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import {
  PermissionSubject,
  PermissionSubjectTarget,
  RequiresPermission,
} from '../permissions/decorators/permissions.decorator';
import { Action } from '../permissions/enums/action.enum';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
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

  @UseGuards(AuthGuard(), PermissionsGuard)
  @ApiPaginatedResponse('entities', User)
  @RequiresPermission(
    PermissionSubject.USERS,
    Action.READ,
    PermissionSubjectTarget.ANY,
  )
  @Get('list')
  async geAllUsers(@Query() query: PublicUserInfoDto) {
    return this.usersService.getAllUsers(query);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: UserCreateDto })
  @Post('account/create')
  async createUserAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.usersService.createUser(body);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @RequiresPermission(
    PermissionSubject.USERS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
  @Get(':userId')
  async getUserProfile(@Param('userId') id: string) {
    return this.usersService.getOneUser(id);
  }
  @UseGuards(AuthGuard(), PermissionsGuard)
  @RequiresPermission(
    PermissionSubject.USERS,
    Action.DELETE,
    PermissionSubjectTarget.SOME,
  )
  @Delete(':userId')
  async deleteUserAccount(@Param('userId') userId: string) {
    return this.usersService.delete(userId);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @UseGuards(PermissionsGuard)
  @RequiresPermission(
    PermissionSubject.USERS,
    Action.UPDATE,
    PermissionSubjectTarget.SOME,
  )
  @Patch(':userId')
  async update(@Param('userId') userId: string, @Body() body: UserUpdateDto) {
    return this.usersService.update(+userId, body);
  }
}
