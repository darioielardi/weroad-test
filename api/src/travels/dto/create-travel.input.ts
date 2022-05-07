import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
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

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  natureMood?: number;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  relaxMood?: number;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  historyMood?: number;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  cultureMood?: number;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  partyMood?: number;
}
