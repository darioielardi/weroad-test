import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

@InputType()
export class CreateTourInput {
  @IsString()
  @IsUUID()
  travelId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  startingDate: Date;

  @IsDate()
  endingDate: Date;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(0)
  price: number;
}
