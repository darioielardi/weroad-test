import { InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsDivisibleBy,
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

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsDivisibleBy(100)
  price: number;
}
