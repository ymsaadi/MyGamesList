import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from '../../common/services/prisma/prisma.service';

@Module({
    imports: [HttpModule],
    controllers: [GameController],
    providers: [GameService, PrismaService],
})
export class GameModule {
}
