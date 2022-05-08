import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Delete Travel (e2e)', () => {
  let app: INestApplication;
  let travelsRepo: EntityRepository<Travel>;
  let jwtService: JwtService;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, travelsRepo, jwtService, teardown } = await testSetup());
  });

  afterEach(async () => {
    await teardown();
  });

  test('requires auth', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
            mutation {
              deleteTravel(id: "${faker.datatype.uuid()}")
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
      });
  });

  test('forbidden to editor', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.EDITOR,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        query: `
            mutation {
              deleteTravel(id: "${faker.datatype.uuid()}")
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN');
      });
  });

  test('not found', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ADMIN,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        query: `
            mutation {
              deleteTravel(id: "${faker.datatype.uuid()}")
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('404');
      });
  });

  test('success', async () => {
    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      description: faker.lorem.sentences(),
      slug: faker.lorem.slug(),
      numberOfDays: faker.datatype.number(),
    });

    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ADMIN,
    });

    await request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        query: `
            mutation {
              deleteTravel(id: "${travelId}")
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toEqual({ deleteTravel: true });
      });

    const travel = await travelsRepo.findOne(travelId);

    expect(travel).toBeNull();
  });
});
