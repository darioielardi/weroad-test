import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role, User } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Create Tour (e2e)', () => {
  let app: INestApplication;
  let toursRepo: EntityRepository<Tour>;
  let travelsRepo: EntityRepository<Travel>;
  let usersRepo: EntityRepository<User>;
  let jwtService: JwtService;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, travelsRepo, toursRepo, usersRepo, jwtService, teardown } =
      await testSetup());
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
            travelId: faker.datatype.uuid(),
            name: faker.random.alpha(100),
            startingDate: new Date('2030-02-01'),
            endingDate: new Date('2030-03-01'),
            price: 100000,
          },
        },
        query: `
            mutation($data: CreateTourInput!) {
              createTour(data: $data) {
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

  test('forbidden to editor', async () => {
    const editorId = await usersRepo.nativeInsert({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Role.EDITOR,
    });

    const token = jwtService.sign({ sub: editorId });

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: {
          data: {
            travelId: faker.datatype.uuid(),
            name: faker.random.alpha(100),
            startingDate: new Date('2030-02-01'),
            endingDate: new Date('2030-03-01'),
            price: 100000,
          },
        },
        query: `
            mutation($data: CreateTourInput!) {
              createTour(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN');
      });
  });

  test('travel not found', async () => {
    const adminId = await usersRepo.nativeInsert({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Role.ADMIN,
    });

    const token = jwtService.sign({ sub: adminId });

    const travelId = faker.datatype.uuid();

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: {
          data: {
            travelId,
            name: faker.random.alpha(100),
            startingDate: new Date('2030-02-01'),
            endingDate: new Date('2030-03-01'),
            price: 100000,
          },
        },
        query: `
            mutation($data: CreateTourInput!) {
              createTour(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors[0].extensions.code).toBe('404');
        expect(res.body.errors[0].message).toBe(`travel-not-found`);
      });
  });

  test('success', async () => {
    const adminId = await usersRepo.nativeInsert({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Role.ADMIN,
    });

    const token = jwtService.sign({ sub: adminId });

    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
    });

    const data = {
      travelId,
      name: faker.random.alpha(100),
      startingDate: new Date('2030-02-01'),
      endingDate: new Date('2030-03-01'),
      price: 100000,
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: { data },
        query: `
            mutation($data: CreateTourInput!) {
              createTour(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect(async (res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.createTour).toBeDefined();
        expect(res.body.data.createTour.id).toBeDefined();

        const tour = await toursRepo.findOne(res.body.data.createTour.id);

        expect(tour).toBeDefined();
        expect(tour.name).toBe(data.name);
        expect(tour.startingDate.getTime()).toBe(data.startingDate.getTime());
        expect(tour.endingDate.getTime()).toBe(data.endingDate.getTime());
        expect(tour.price).toBe(data.price * 100);
      });
  });
});
