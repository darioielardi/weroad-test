import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';

@Module({
  providers: [TravelsResolver, TravelsService]
})
export class TravelsModule {}
