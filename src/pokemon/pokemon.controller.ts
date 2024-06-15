import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggingInterceptor } from '../auth/logging.interceptor';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }
}
