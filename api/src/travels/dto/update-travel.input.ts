import { InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateTravelInput } from './create-travel.input';

@InputType()
export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  @IsString()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
