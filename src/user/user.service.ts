import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword });
    return newUser.save();
  }

  async delete(username: string): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.userModel.deleteOne({ username }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    return { deleted: true };
  }

}
