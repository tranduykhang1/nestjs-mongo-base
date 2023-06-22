import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ESortField, ESortOrder } from '../enum/sort.enum';
import { Type } from 'class-transformer';

export class DefaultListDto {
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
    enum: ESortField,
    example: 'createdAt',
  })
  @IsEnum(ESortField)
  @IsOptional()
  sortField?: ESortField;

  @ApiProperty({
    required: false,
    description: 'Sort newest or oldest',
    enum: ESortOrder,
    example: 'asc',
  })
  @IsEnum(ESortOrder)
  @IsOptional()
  sortOrder?: ESortOrder;
}
