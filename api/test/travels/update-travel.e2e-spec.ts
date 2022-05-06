import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role, User } from '../../src/users/entities/user.entity';

describe('Update Travel (e2e)', () => {
  let app: INestApplication;
  let usersRepo: EntityRepository<User>;
  let travelsRepo: EntityRepository<Travel>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersRepo = app.get(getRepositoryToken(User));
    travelsRepo = app.get(getRepositoryToken(Travel));
    jwtService = app.get(JwtService);
  });

  test('requires auth', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        variables: {
          data: {
            id: faker.datatype.uuid(),
            name: faker.lorem.sentence(),
          },
        },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
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
            id: faker.datatype.uuid(),
            name: faker.lorem.sentence(),
          },
        },
        query: `
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
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

    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
      isPublic: true,
    });

    const data = {
      id: travelId,
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
            mutation($data: UpdateTravelInput!) {
              updateTravel(data: $data) {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect(async (res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.updateTravel).toBeDefined();
        expect(res.body.data.updateTravel.id).toBeDefined();

        const travel = await travelsRepo.findOne(travelId);

        expect(travel).toBeDefined();
        expect(travel.name).toBe(data.name);
        expect(travel.slug).toBe(data.slug);
        expect(travel.description).toBe(data.description);
        expect(travel.numberOfDays).toBe(data.numberOfDays);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
