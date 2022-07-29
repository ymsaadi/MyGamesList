import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PAGINATION_LIMIT } from '../../common/constants';
import { SearchSortPaginateDto } from '../../common/dtos/search-sort-paginate.dto';
import { PrismaService } from '../../common/services/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService, private readonly prisma: PrismaService) {
    }

    async findAll({ page = 1, limit = PAGINATION_LIMIT, search = '', orderBy = 'id', orderDir = 'asc' }: SearchSortPaginateDto) {
        const offset = (page - 1) * limit;
        return lastValueFrom(this.httpService.post(
            'https://api.igdb.com/v4/games',
            `fields id,name,genres.name,slug,collection.name,game_modes.name,platforms.name,release_dates.human,cover.url,themes.name,storyline;search \"${search}\";limit ${limit};offset ${offset};`,
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
}
