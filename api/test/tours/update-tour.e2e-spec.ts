import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Update Tour (e2e)', () => {
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
        variables: {
          data: {
            id: faker.datatype.uuid(),
          },
        },
        query: `
            mutation($data: UpdateTourInput!) {
              updateTour(data: $data) {
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

  test('tour not found', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ADMIN,
    });

    const tourId = faker.datatype.uuid();

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: {
          data: {
            id: tourId,
          },
        },
        query: `
            mutation($data: UpdateTourInput!) {
              updateTour(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('404');
        expect(res.body.errors[0].message).toBe('tour-not-found');
      });
  });

  test('success (editor)', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.EDITOR,
    });

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

    const data = {
      id: tourId,
      name: faker.random.alpha(100),
      startingDate: new Date('2030-02-10'),
      endingDate: new Date('2030-03-10'),
      price: 200000,
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: { data },
        query: `
            mutation($data: UpdateTourInput!) {
              updateTour(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect(async (res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.updateTour).toBeDefined();
        expect(res.body.data.updateTour.id).toBeDefined();

        const tour = await toursRepo.findOne(tourId);

        expect(tour).toBeDefined();
        expect(tour.name).toBe(data.name);
        expect(tour.startingDate.getTime()).toBe(data.startingDate.getTime());
        expect(tour.endingDate.getTime()).toBe(data.endingDate.getTime());
        expect(tour.price).toBe(data.price * 100);
      });
  });
});
