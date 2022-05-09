import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Find Tour (e2e)', () => {
  let app: INestApplication;
  let toursRepo: EntityRepository<Tour>;
  let travelsRepo: EntityRepository<Travel>;
  let jwtService: JwtService;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, travelsRepo, toursRepo, jwtService, teardown } = await testSetup());
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
            tour(id: "${faker.datatype.uuid()}") {
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
            tour(id: "${faker.datatype.uuid()}") {
              id
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors[0].extensions.code).toBe('404');
        expect(res.body.errors[0].message).toBe('tour-not-found');
      });
  });

  test('success', async () => {
    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
    });

    const tourId = await toursRepo.nativeInsert({
      travel: travelId,
      name: faker.random.alpha(100),
      startingDate: new Date('2030-02-01'),
      endingDate: new Date('2030-03-01'),
      price: 100000,
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
            tour(id: "${tourId}") {
              id
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.tour.id).toBe(tourId);
      });
  });
});
