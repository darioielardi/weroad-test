import { faker } from '@faker-js/faker';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role, User } from '../../src/users/entities/user.entity';

describe('List Travel (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let usersRepo: EntityRepository<User>;
  let travelsRepo: EntityRepository<Travel>;
  let toursRepo: EntityRepository<Tour>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    orm = app.get(MikroORM);
    usersRepo = app.get(getRepositoryToken(User));
    travelsRepo = app.get(getRepositoryToken(Travel));
    toursRepo = app.get(getRepositoryToken(Tour));
    jwtService = app.get(JwtService);
  });

  it('returns only public travels when no auth', async () => {
    await orm.getSchemaGenerator().clearDatabase();

    const [publicTravelId] = await Promise.all([
      travelsRepo.nativeInsert({
        name: faker.name.findName(),
        slug: faker.lorem.slug(),
        description: faker.lorem.sentence(),
        numberOfDays: faker.datatype.number(),
        isPublic: true,
      }),
      travelsRepo.nativeInsert({
        name: faker.name.findName(),
        slug: faker.lorem.slug(),
        description: faker.lorem.sentence(),
        numberOfDays: faker.datatype.number(),
        isPublic: false,
      }),
    ]);

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
            query {
              travels {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travels).toHaveLength(1);
        expect(res.body.data.travels[0].id).toBe(publicTravelId);
      });
  });

  it('returns all travels when auth', async () => {
    await orm.getSchemaGenerator().clearDatabase();

    const adminId = await usersRepo.nativeInsert({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Role.ADMIN,
    });

    const token = jwtService.sign({ sub: adminId });

    await Promise.all([
      travelsRepo.nativeInsert({
        name: faker.name.findName(),
        slug: faker.lorem.slug(),
        description: faker.lorem.sentence(),
        numberOfDays: faker.datatype.number(),
        isPublic: true,
      }),
      travelsRepo.nativeInsert({
        name: faker.name.findName(),
        slug: faker.lorem.slug(),
        description: faker.lorem.sentence(),
        numberOfDays: faker.datatype.number(),
        isPublic: false,
      }),
    ]);

    return request(app.getHttpServer())
      .post('/graphql')
      .auth(token, { type: 'bearer' })
      .send({
        query: `
            query {
              travels {
                id
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travels).toHaveLength(2);
      });
  });

  it('loads tours', async () => {
    await orm.getSchemaGenerator().clearDatabase();

    const travelId = await travelsRepo.nativeInsert({
      name: faker.lorem.sentence(),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      numberOfDays: faker.datatype.number(),
      isPublic: true,
    });

    const tourId = await toursRepo.nativeInsert({
      travel: travelId,
      name: faker.lorem.sentence(),
      startingDate: new Date('2030-01-01'),
      endingDate: new Date('2030-01-02'),
      price: 100000,
    });

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
            query {
              travels {
                id
                tours {
                  id
                }
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travels).toHaveLength(1);
        expect(res.body.data.travels[0].tours).toHaveLength(1);
        expect(res.body.data.travels[0].tours[0].id).toBe(tourId);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
