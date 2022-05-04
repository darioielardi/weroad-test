import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTourInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
