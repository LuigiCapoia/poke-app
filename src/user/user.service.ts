import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword });
    return newUser.save();
  }

  async deleteById(
    id: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    this.logger.log(`Deleting user with id: ${id}`);
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      this.logger.warn(`User not found with id: ${id}`);
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    this.logger.log(`User deleted with id: ${id}`);
    return { deleted: true };
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }
    return updatedUser;
  }
  async addPokemonToUser(
    userId: string,
    pokemonId: Types.ObjectId,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }
    if (!user.pokemons.includes(pokemonId)) {
      user.pokemons.push(pokemonId);
      await user.save();
    }
    return user;
  }
  async deleteAllPokemonsFromUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID '${userId}' not found`);
    }
    user.pokemons = [];
    await user.save();
    return user;
  }
}
