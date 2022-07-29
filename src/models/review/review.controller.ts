import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() request: Request, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(request.user.id, createReviewDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() request: Request) {
        return this.reviewService.findAll(request.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reviewService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Req() request: Request, @Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.update(+id, request.user.id, updateReviewDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Req() request: Request, @Param('id') id: string) {
        return this.reviewService.remove(+id, request.user.id);
    }
}
