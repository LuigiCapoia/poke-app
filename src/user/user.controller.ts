import { Controller, Post, Body, Delete, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './schemas/user.schema'; // Certifique-se de importar o schema do usuário

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
    const user: User = await this.userService.findOne(username);
    if (user) {
      return this.userService.deleteById(user._id.toString()); // Convertendo _id para string
    } else {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
  }
}
