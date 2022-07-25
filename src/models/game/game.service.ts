import { HttpException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { HttpService } from '@nestjs/axios';
import { UpdateGameDto } from './dto/update-game.dto';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    }

    create(createGameDto: CreateGameDto) {
        return 'This action adds a new game';
    }

    async findAll() {
        return lastValueFrom(this.httpService.post(
            'https://api.igdb.com/v4/games',
            'fields id,name,genres.name,slug,collection.name,game_modes.name,platforms.name,release_dates.human,cover.url,themes.name,storyline;',
            {
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': this.configService.get<string>('CLIENT_ID'),
                    'Authorization': `Bearer ${this.configService.get<string>('TOKEN')}`,
                },
            },
        )
            .pipe(map(response => {
                return response.data;
            }))
            .pipe(catchError(e => {
                throw new HttpException(e.response.data, e.response.status);
            })));
    }

    findOne(id: number) {
        return `This action returns a #${id} game`;
    }

    update(id: number, updateGameDto: UpdateGameDto) {
        return `This action updates a #${id} game`;
    }

    remove(id: number) {
        return `This action removes a #${id} game`;
    }
}
