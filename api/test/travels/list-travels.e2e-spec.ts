import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Role } from '../../src/users/entities/user.entity';
import { Teardown, testSetup } from '../test-utils';

describe('List Travel (e2e)', () => {
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

  it('returns only public travels when no auth', async () => {
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
              travels(page: 1, rows: 100) {
                items {
                  id
                }
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travels.items).toHaveLength(1);
        expect(res.body.data.travels.items[0].id).toBe(publicTravelId);
      });
  });

  it('returns all travels when auth', async () => {
    const token = jwtService.sign({
      sub: faker.datatype.uuid(),
      role: Role.ADMIN,
    });

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
              travels(page: 1, rows: 100) {
                items {
                  id
                }
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travels.items).toHaveLength(2);
      });
  });

  it('loads tours', async () => {
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
              travels(page: 1, rows: 100) {
                items {
                  id
                  tours {
                    id
                  }
                }
              }
            }
          `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.travels.items).toHaveLength(1);
        expect(res.body.data.travels.items[0].tours).toHaveLength(1);
        expect(res.body.data.travels.items[0].tours[0].id).toBe(tourId);
      });
  });
});
