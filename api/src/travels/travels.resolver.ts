import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, Public } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { Admin, Editor } from '../auth/roles.decorator';
import { PaginationArgs } from '../common/pagination.args';
import { CreateTravelInput } from './dto/create-travel.input';
import { PaginatedTravels } from './dto/list-travels.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { Travel } from './entities/travel.entity';
import { TravelsService } from './travels.service';

@Auth()
@Resolver(() => Travel)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Admin()
  @Mutation(() => Travel)
  createTravel(@Args('data') input: CreateTravelInput) {
    return this.travelsService.create(input);
  }

  @Public()
  @Query(() => PaginatedTravels, { name: 'travels' })
  findAll(@Args() args: PaginationArgs, @CurrentUser() user: AuthUser | null) {
    return this.travelsService.findAll({
      publicOnly: user === null,
      ...args,
    });
  }

  @Editor()
  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.travelsService.findOne(id);
  }

  @Admin()
  @Mutation(() => Travel)
  updateTravel(@Args('data') input: UpdateTravelInput) {
    return this.travelsService.update(input.id, input);
  }

  @Admin()
  @Mutation(() => Boolean)
  async deleteTravel(@Args('id', { type: () => String }) id: string) {
    await this.travelsService.delete(id);
    return true;
  }
}
