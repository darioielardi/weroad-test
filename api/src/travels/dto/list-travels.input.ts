import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination.args';
import { Travel } from '../entities/travel.entity';

@ObjectType()
export class PaginatedTravels extends Paginated(Travel) {}
