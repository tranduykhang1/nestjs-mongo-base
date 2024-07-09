import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { SORT_FIELD, SORT_ORDER } from '../enums/sort.enum';

export class DefaultQueryDto {
  @ApiProperty({
    required: false,
    description: 'Number of items limited',
    default: 10,
  })
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @ApiProperty({
    required: false,
    description: 'Number of items skipped',
    default: 0,
  })
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @ApiProperty({
    required: false,
    description: 'Search value for the expected result',
    example: 'search@gmail.com',
  })
  @IsString()
  @IsOptional()
  searchValue?: string;

  @ApiProperty({
    required: false,
    description: 'The name of field searched',
    example: 'id',
  })
  @IsString()
  @IsOptional()
  searchField?: string;

  @ApiProperty({
    required: false,
    description: 'The name of sort field sorted',
    enum: SORT_FIELD,
    example: 'createdAt',
  })
  @IsEnum(SORT_FIELD)
  @IsOptional()
  sortField?: SORT_FIELD;

  @ApiProperty({
    required: false,
    description: 'Sort newest or oldest',
    enum: SORT_ORDER,
    example: 'asc',
  })
  @IsEnum(SORT_ORDER)
  @IsOptional()
  sortOrder?: SORT_ORDER;
}
