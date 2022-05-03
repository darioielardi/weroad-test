import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['dist/**/*.entity{.ts,.js}'],
      entitiesTs: ['src/**/*.entity{.ts,.js}'],
      dbName: 'weroad-dev',
      type: 'postgresql',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
