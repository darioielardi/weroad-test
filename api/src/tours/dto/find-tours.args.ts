import {
  ArgsType,
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional } from 'class-validator';
import { Paginated, PaginationArgs } from '../../common/pagination.args';
import { Tour } from '../entities/tour.entity';

@ArgsType()
export class FindToursArgs extends PaginationArgs {
  travelSlug: string;

  // filters

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsInt()
  priceFrom?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @IsInt()
  priceTo?: number;

  @IsOptional()
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @IsDate()
  dateTo?: Date;

  // sort by

  sortBy?: ToursSortBy;
}

export enum ToursSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

registerEnumType(ToursSortBy, {
  name: 'ToursSortBy',
});

// response type

@ObjectType()
export class PaginatedTours extends Paginated(Tour) {}
