import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

@InputType()
export class CreateTravelInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'invalid slug' })
  slug: string;

  @IsString()
  description: string;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(1)
  numberOfDays: number;
}
