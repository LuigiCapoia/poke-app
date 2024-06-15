import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PokemonService {
  constructor(private httpService: HttpService) {}

  findAll(): Observable<any> {
    return this.httpService.get('https://pokeapi.co/api/v2/pokemon')
      .pipe(map(response => response.data));
  }

  findOne(id: string): Observable<any> {
    return this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .pipe(map(response => response.data));
  }
}
