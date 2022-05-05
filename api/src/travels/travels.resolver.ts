import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, Public } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { Admin } from '../auth/roles.decorator';
import { CreateTravelInput } from './dto/create-travel.input';
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
  @Query(() => [Travel], { name: 'travels' })
  findAll(@CurrentUser() user: AuthUser | null) {
    return this.travelsService.findAll({
      publicOnly: user === null,
    });
  }

  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.travelsService.findOne(id);
  }

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
