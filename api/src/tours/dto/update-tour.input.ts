import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { CreateTourInput } from './create-tour.input';

@InputType()
export class UpdateTourInput extends PartialType(
  OmitType(CreateTourInput, ['travelId'] as const),
) {
  @IsString()
  @IsUUID()
  id: string;
}
