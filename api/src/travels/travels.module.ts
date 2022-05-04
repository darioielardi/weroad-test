import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Travel } from './entities/travel.entity';
import { TravelsResolver } from './travels.resolver';
import { TravelsService } from './travels.service';

@Module({
  imports: [MikroOrmModule.forFeature([Travel])],
  providers: [TravelsResolver, TravelsService],
  exports: [TravelsService],
})
export class TravelsModule {}
