import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserloginDto } from './dto/user.login.dto';
import { PublicUserData } from './interface/user.interface';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiExtraModels(PublicUserData, PaginatedDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard())
  @ApiPaginatedResponse('entities', PublicUserData)
  @Get('list')
  async getUserList(@Query() query: PublicUserInfoDto) {
    return this.usersService.getAllUsers(query);
  }

  @Post('account/create')
  async createUserAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.usersService.createUser(body);
  }

  @Post('login')
  async loginUser(@Body() body: UserloginDto) {
    return this.usersService.login(body);
  }
  // @Get(':userId')
  // async getUserProfile(@Param('userId') userId: string) {
  //   return this.usersService.;
  // }

  // @Delete(':userId')
  // async deleteUserAccount(@Param('userId') userId: string) {
  //   return this.usersService.remove(+userId);;
  // }

  // @Patch(':userId')
  // async updateUserProfile(@Param('userId') userId: string, @Body() body: any) {
  //   return '';
  // }
  // @Patch(':userId')
  // async update(
  //   @Param('userId') userId: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.update(+userId, updateUserDto);
  // }
}
