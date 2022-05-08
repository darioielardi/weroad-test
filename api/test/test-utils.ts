import faker from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv';
import ormConfig from '../mikro-orm.config';
import { AppModule } from '../src/app.module';
import { Tour } from '../src/tours/entities/tour.entity';
import { Travel } from '../src/travels/entities/travel.entity';
import { User } from '../src/users/entities/user.entity';

// we can't wait for @nestjs/config to load the env,
// we need DATABASE_URL beforehand to initialize the ORM, so we need to load it manually
dotenv.config({ path: '.env.test' });

// we can set a schema prefix to identify the schema afterwards
export async function testSetup(schemaPrefix?: string, dropSchema = true) {
  // every test needs a fresh db schema
  const schema = (schemaPrefix || '') + faker.datatype.uuid();

  const orm = await MikroORM.init({
    entities: ormConfig.entities,
    type: 'postgresql',
    clientUrl: process.env.DATABASE_URL,
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
    if (dropSchema) {
      const conn = orm.em.getConnection();
      await conn.execute(`DROP SCHEMA "${schema}" CASCADE;`);
      await conn.close();
    }

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
