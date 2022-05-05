import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser, Public } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { Admin } from '../auth/roles.decorator';
import { CreateTourInput } from './dto/create-tour.input';
import { FindToursArgs } from './dto/find-tours.args';
import { UpdateTourInput } from './dto/update-tour.input';
import { Tour } from './entities/tour.entity';
import { ToursService } from './tours.service';

@Auth()
@Resolver(() => Tour)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Admin()
  @Mutation(() => Tour)
  createTour(@Args('data') input: CreateTourInput) {
    return this.toursService.create(input);
  }

  @Public()
  @Query(() => [Tour], { name: 'toursByTravel' })
  findByTravel(
    @Args() args: FindToursArgs,
    @CurrentUser() user: AuthUser | null,
  ) {
    return this.toursService.findByTravel(args, user === null);
  }

  @Query(() => Tour, { name: 'tour' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.toursService.findOne(id);
  }

  @Mutation(() => Tour)
  updateTour(@Args('data') input: UpdateTourInput) {
    return this.toursService.update(input);
  }

  @Mutation(() => Tour)
  removeTour(@Args('id', { type: () => Int }) id: number) {
    return this.toursService.remove(id);
  }
}
