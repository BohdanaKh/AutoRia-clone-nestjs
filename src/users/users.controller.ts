import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @UseGuards(AuthGuard())
  @Get('list')
  async getUserList() {
    return this.userService.getAllUsers();
  }

  @Post('account/create')
  async createUserAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    return '';
  }

  @Delete(':userId')
  async deleteUserAccount(@Param('userId') userId: string) {
    return '';
  }

  @Patch(':userId')
  async updateUserProfile(@Param('userId') userId: string, @Body() body: any) {
    return '';
  }
}
