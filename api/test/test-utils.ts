import faker from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import ormConfig from '../mikro-orm.config';
import { AppModule } from '../src/app.module';
import { Tour } from '../src/tours/entities/tour.entity';
import { Travel } from '../src/travels/entities/travel.entity';
import { User } from '../src/users/entities/user.entity';

export async function testSetup() {
  const schema = faker.datatype.uuid();

  const orm = await MikroORM.init({
    entities: ormConfig.entities,
    type: 'postgresql',
    clientUrl: `postgres://postgres:secret@localhost:5432/weroad-test`,
    schema,
  });

  await orm.getSchemaGenerator().createSchema();

  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(MikroORM)
    .useValue(orm)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  async function teardown() {
    const conn = orm.em.getConnection();
    await conn.execute(`DROP SCHEMA "${schema}" CASCADE;`);
    await conn.close();

    await orm.close();
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
