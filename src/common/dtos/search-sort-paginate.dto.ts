import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { validateOptionalQueryNumber, validateSortDirection } from '../helpers';
import { PAGINATION_LIMIT, SORT_DIRECTION } from '../constants';

export class SearchSortPaginateDto {
    @IsOptional()
    @Transform(({ value }) => validateOptionalQueryNumber(value, 1))
    @IsInt()
    page: number;

    @IsOptional()
    @Transform(({ value }) => validateOptionalQueryNumber(value, PAGINATION_LIMIT))
    @IsInt()
    limit: number;

    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsString()
    orderBy: string;

    @IsOptional()
    @Transform(({ value }) => validateSortDirection(value, SORT_DIRECTION))
    orderDir: string;
}