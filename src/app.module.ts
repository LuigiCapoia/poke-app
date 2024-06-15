import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { DatabaseModule } from './database/database.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon-api'),
    UserModule,
    AuthModule,
    PokemonModule,
    LogModule,
    DatabaseModule,
  ],
})
export class AppModule {}
