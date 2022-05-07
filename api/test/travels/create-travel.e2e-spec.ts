import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role, User } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Create Travel (e2e)', () => {
  let app: INestApplication;
  let usersRepo: EntityRepository<User>;
  let travelsRepo: EntityRepository<Travel>;
  let jwtService: JwtService;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, travelsRepo, usersRepo, jwtService, teardown } = await testSetup());
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
            name: faker.lorem.sentence(),
            slug: faker.lorem.slug(),
            description: faker.lorem.sentence(),
            numberOfDays: faker.datatype.number(),
          },
        },
        query: `
            mutation($data: CreateTravelInput!) {
              createTravel(data: $data) {
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
            name: faker.lorem.sentence(),
            slug: faker.lorem.slug(),
            description: faker.lorem.sentence(),
            numberOfDays: faker.datatype.number(),
          },
        },
        query: `
            mutation($data: CreateTravelInput!) {
              createTravel(data: $data) {
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

  test('success', async () => {
    const adminId = await usersRepo.nativeInsert({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Role.ADMIN,
    });

    const token = jwtService.sign({ sub: adminId });

    const data = {
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        variables: { data },
        query: `
            mutation($data: CreateTravelInput!) {
              createTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect(async (res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.createTravel).toBeDefined();
        expect(res.body.data.createTravel.id).toBeDefined();

        const travel = await travelsRepo.findOne(res.body.data.createTravel.id);

        expect(travel).toBeDefined();
        expect(travel.name).toBe(data.name);
        expect(travel.slug).toBe(data.slug);
        expect(travel.description).toBe(data.description);
        expect(travel.numberOfDays).toBe(data.numberOfDays);
      });
  });
});
