import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Paginated, PaginationArgs } from '../../common/pagination.args';
import { Travel } from '../entities/travel.entity';

@ArgsType()
export class FindTravelsArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  searchTerm?: string;
}

@ObjectType()
export class PaginatedTravels extends Paginated(Travel) {}
