import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsInt()
    gameId: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10)
    score: number;

    @IsOptional()
    @IsString()
    review: string;
}
