import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Delete Tour (e2e)', () => {
  let app: INestApplication;
  let travelsRepo: EntityRepository<Travel>;
  let toursRepo: EntityRepository<Tour>;
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
            mutation {
              deleteTour(id: "${faker.datatype.uuid()}")
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
              deleteTour(id: "${faker.datatype.uuid()}")
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
              deleteTour(id: "${faker.datatype.uuid()}")
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

    const tourId = await toursRepo.nativeInsert({
      name: faker.lorem.sentence(),
      travel: travelId,
      startingDate: new Date('2030-10-01'),
      endingDate: new Date('2030-10-02'),
      price: 1000,
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
              deleteTour(id: "${tourId}")
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toEqual({ deleteTour: true });
      });

    const tour = await toursRepo.findOne(tourId);

    expect(tour).toBeNull();
  });
});
