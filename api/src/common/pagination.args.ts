import { Type } from '@nestjs/common';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  page: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @Min(0)
  rows: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

export function Paginated<T>(classRef: Type<T>): Type<PaginatedResponse<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements PaginatedResponse<T> {
    @Field(() => [classRef])
    items: T[];

    @Field(() => Int)
    count: number;
  }

  return PaginatedType as Type<PaginatedResponse<T>>;
}
