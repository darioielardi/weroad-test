import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Travel } from './travels/entities/travel.entity';
import { TravelsModule } from './travels/travels.module';
import { Role } from './users/entities/role.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      entities: [User, Role, Travel],
      dbName: process.env.NODE_ENV === 'test' ? 'weroad-test' : 'weroad-dev',
      type: 'postgresql',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    UsersModule,
    AuthModule,
    TravelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
