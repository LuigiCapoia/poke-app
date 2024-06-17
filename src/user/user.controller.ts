import { Controller, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto.username, createUserDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  async delete(@Param('username') username: string) {
    return this.userService.delete(username);
  }
}
