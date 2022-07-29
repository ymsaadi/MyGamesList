import { Controller, Get, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { SearchSortPaginateDto } from '../../common/dtos/search-sort-paginate.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  findAll(@Query() query: SearchSortPaginateDto) {
    return this.gameService.findAll(query);
  }
}
