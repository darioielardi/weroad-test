import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Find Travel (e2e)', () => {
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
          query {
            travel(id: "${faker.datatype.uuid()}") {
              id
            }
          }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
      });
  });

  test('not found', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.EDITOR,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        query: `
          query {
            travel(id: "${faker.datatype.uuid()}") {
              id
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors[0].extensions.code).toBe('404');
        expect(res.body.errors[0].message).toBe('travel-not-found');
      });
  });

  test('success', async () => {
    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
    });

    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.EDITOR,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        query: `
          query {
            travel(id: "${travelId}") {
              id
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travel.id).toBe(travelId);
      });
  });
});
