import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
    constructor(private readonly prisma: PrismaService,
                private readonly httpService: HttpService,
                private readonly configService: ConfigService) {
    }

    create(userId: number, createReviewDto: CreateReviewDto) {
        return this.prisma.review.create({
            data: {
                ...createReviewDto,
                userId,
            },
        });
    }

    async findAll(userId: number) {
        const reviews = await this.prisma.review.findMany({
            where: {
                userId,
            },
        });

        const unresolvedExtendedReviews = reviews.map(async (review) => {
            try {
                const game = await lastValueFrom(this.httpService.post(
                    'https://api.igdb.com/v4/games',
                    `fields id,name,genres.name,slug,collection.name,game_modes.name,platforms.name,release_dates.human,cover.url,themes.name,storyline;where id = ${review.gameId};limit 1;`,
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
                        })),
                );

                return { ...review, game };
            } catch (e) {
                console.log(e);
            }
        });

        const resolvedExtendedReviews = await Promise.all(unresolvedExtendedReviews);

        return resolvedExtendedReviews;
    }

    findOne(id: number) {
        return `This action returns a #${id} review`;
    }

    async update(id: number, userId: number, updateReviewDto: UpdateReviewDto) {
        const review = await this.prisma.review.findUnique({
            where: {
                id,
            },
        });

        if (!review) {
            throw new NotFoundException('no such review');
        }

        if (review.userId !== userId) {
            throw new UnauthorizedException('you can\'t modify that review');
        }

        return this.prisma.review.update({
            where: {
                id,
            },
            data: updateReviewDto,
        });
    }

    async remove(id: number, userId: number) {
        const review = await this.prisma.review.findUnique({
            where: {
                id,
            },
        });

        if (!review) {
            throw new NotFoundException('no such review');
        }

        if (review.userId !== userId) {
            throw new UnauthorizedException('you can\'t modify that review');
        }

        return this.prisma.review.delete({
            where: {
                id,
            },
        });
    }
}
