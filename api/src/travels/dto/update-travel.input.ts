import { CreateTravelInput } from './create-travel.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  @Field(() => Int)
  id: number;
}
