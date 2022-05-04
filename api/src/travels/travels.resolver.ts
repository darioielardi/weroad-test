import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { Travel } from './entities/travel.entity';
import { TravelsService } from './travels.service';

@UseGqlAuthGuard()
@Resolver(() => Travel)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Mutation(() => Travel)
  createTravel(@Args('data') input: CreateTravelInput) {
    return this.travelsService.create(input);
  }

  @Query(() => [Travel], { name: 'travels' })
  findAll() {
    return this.travelsService.findAll();
  }

  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.travelsService.findOne(id);
  }

  @Mutation(() => Travel)
  updateTravel(@Args('data') input: UpdateTravelInput) {
    return this.travelsService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteTravel(@Args('id', { type: () => String }) id: string) {
    await this.travelsService.delete(id);
    return true;
  }
}
