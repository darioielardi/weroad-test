import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TravelsModule } from '../travels/travels.module';
import { Tour } from './entities/tour.entity';
import { ToursResolver } from './tours.resolver';
import { ToursService } from './tours.service';

@Module({
  imports: [MikroOrmModule.forFeature([Tour]), TravelsModule],
  providers: [ToursResolver, ToursService],
})
export class ToursModule {}
