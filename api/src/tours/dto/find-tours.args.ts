import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional, Max } from 'class-validator';

@ArgsType()
export class FindToursArgs {
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

  // pagination

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @Max(100)
  limit: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  offset: number;
}

export enum ToursSortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

registerEnumType(ToursSortBy, {
  name: 'ToursSortBy',
});
