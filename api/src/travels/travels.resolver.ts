import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TravelsService } from './travels.service';
import { Travel } from './entities/travel.entity';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';

@Resolver(() => Travel)
export class TravelsResolver {
  constructor(private readonly travelsService: TravelsService) {}

  @Mutation(() => Travel)
  createTravel(@Args('createTravelInput') createTravelInput: CreateTravelInput) {
    return this.travelsService.create(createTravelInput);
  }

  @Query(() => [Travel], { name: 'travels' })
  findAll() {
    return this.travelsService.findAll();
  }

  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.travelsService.findOne(id);
  }

  @Mutation(() => Travel)
  updateTravel(@Args('updateTravelInput') updateTravelInput: UpdateTravelInput) {
    return this.travelsService.update(updateTravelInput.id, updateTravelInput);
  }

  @Mutation(() => Travel)
  removeTravel(@Args('id', { type: () => Int }) id: number) {
    return this.travelsService.remove(id);
  }
}
