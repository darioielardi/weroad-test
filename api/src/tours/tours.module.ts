import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursResolver } from './tours.resolver';

@Module({
  providers: [ToursResolver, ToursService]
})
export class ToursModule {}
