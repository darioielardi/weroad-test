import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateTourInput } from './dto/create-tour.input';
import { UpdateTourInput } from './dto/update-tour.input';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';

@UseGqlAuthGuard()
@Resolver(() => Tour)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Mutation(() => Tour)
  createTour(@Args('data') input: CreateTourInput) {
    return this.toursService.create(input);
  }

  @Query(() => [Tour], { name: 'tours' })
  findAll() {
    return this.toursService.findAll();
  }

  @Query(() => Tour, { name: 'tour' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.toursService.findOne(id);
  }

  @Mutation(() => Tour)
  updateTour(@Args('data') updateTourInput: UpdateTourInput) {
    return this.toursService.update(updateTourInput.id, updateTourInput);
  }

  @Mutation(() => Tour)
  removeTour(@Args('id', { type: () => Int }) id: number) {
    return this.toursService.remove(id);
  }
}
