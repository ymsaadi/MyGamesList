import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../common/services/prisma/prisma.service';

@Injectable()
export class ReviewService {
    constructor(private readonly prisma: PrismaService) {
    }

    create(userId: number, createReviewDto: CreateReviewDto) {
        return this.prisma.review.create({
            data: {
                ...createReviewDto,
                userId,
            },
        });
    }

    findAll(userId: number) {
        return this.prisma.review.findMany({
            where: {
                userId,
            },
        });
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
