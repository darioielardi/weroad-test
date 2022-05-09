import { MikroORM } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Tour } from '../src/tours/entities/tour.entity';
import { Travel } from '../src/travels/entities/travel.entity';
import { User } from '../src/users/entities/user.entity';

export async function testSetup() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const orm = app.get(MikroORM);

  async function teardown() {
    await app.close();
  }

  return {
    app,
    orm,

    usersRepo: orm.em.getRepository(User),
    travelsRepo: orm.em.getRepository(Travel),
    toursRepo: orm.em.getRepository(Tour),

    jwtService: app.get(JwtService),

    teardown,
  };
}

export type Teardown = () => Promise<void>;
