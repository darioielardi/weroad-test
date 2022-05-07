import { faker } from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Tour } from '../../src/tours/entities/tour.entity';
import { Travel } from '../../src/travels/entities/travel.entity';
import { Teardown, testSetup } from '../test-utils';

describe('Find Tours (e2e)', () => {
  let app: INestApplication;
  let toursRepo: EntityRepository<Tour>;
  let travelsRepo: EntityRepository<Travel>;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, travelsRepo, toursRepo, teardown } = await testSetup());
  });

  afterEach(async () => {
    await teardown();
  });

  describe('find tours by travel slug', () => {
    test('travel slug does not exist', async () => {
      const slug = 'not-found';

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              toursByTravel(travelSlug: "${slug}", limit: 10, offset: 0) {
                items {
                  id
                }
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

    test('travel is not public', async () => {
      const slug = faker.random.alpha(100);

      await travelsRepo.nativeInsert({
        isPublic: false,
        slug,
        name: faker.random.alpha(100),
        description: 'Private travel description',
        numberOfDays: 10,
      });

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              toursByTravel(travelSlug: "${slug}", limit: 10, offset: 0) {
                items {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeNull();
          expect(res.body.errors[0].extensions.code).toBe('404');
          expect(res.body.errors[0].message).toBe('travel-not-found');
        });
    });

    it('works without filters + default sort by (starting date)', async () => {
      const slug = faker.random.alpha(100);

      const travelId = await travelsRepo.nativeInsert({
        isPublic: true,
        slug,
        name: faker.random.alpha(100),
        description: 'Test travel description',
        numberOfDays: 10,
      });

      const toursIds = await Promise.all([
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 1000,
          travel: travelId,
        }),
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-02-02'),
          endingDate: new Date('2030-03-02'),
          price: 2000,
          travel: travelId,
        }),
      ]);

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              toursByTravel(travelSlug: "${slug}", limit: 10, offset: 0) {
                items {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.toursByTravel.items).toHaveLength(2);
          expect(res.body.data.toursByTravel.items[0].id).toBe(toursIds[0]);
          expect(res.body.data.toursByTravel.items[1].id).toBe(toursIds[1]);
        });
    });

    it('works with price filters', async () => {
      const slug = faker.random.alpha(100);

      const travelId = await travelsRepo.nativeInsert({
        isPublic: true,
        slug,
        name: faker.random.alpha(100),
        description: 'Test travel description',
        numberOfDays: 10,
      });

      const toursIds = await Promise.all([
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 100000,
          travel: travelId,
        }),
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-02-02'),
          endingDate: new Date('2030-03-02'),
          price: 200000,
          travel: travelId,
        }),
      ]);

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              toursByTravel(travelSlug: "${slug}", limit: 10, offset: 0, priceFrom: 500, priceTo: 1500) {
                items {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.toursByTravel.items).toHaveLength(1);
          expect(res.body.data.toursByTravel.items[0].id).toBe(toursIds[0]);
        });
    });

    it('works with date filters', async () => {
      const slug = faker.random.alpha(100);

      const travelId = await travelsRepo.nativeInsert({
        isPublic: true,
        slug,
        name: faker.random.alpha(100),
        description: 'Test travel description',
        numberOfDays: 10,
      });

      const toursIds = await Promise.all([
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 100000,
          travel: travelId,
        }),
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-04-01'),
          endingDate: new Date('2030-05-01'),
          price: 200000,
          travel: travelId,
        }),
      ]);

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              toursByTravel(travelSlug: "${slug}", limit: 10, offset: 0, dateFrom: "2030-01-15", dateTo: "2030-03-10") {
                items {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.toursByTravel.items).toHaveLength(1);
          expect(res.body.data.toursByTravel.items[0].id).toBe(toursIds[0]);
        });
    });

    it('works with sort', async () => {
      const slug = faker.random.alpha(100);

      const travelId = await travelsRepo.nativeInsert({
        isPublic: true,
        slug,
        name: faker.random.alpha(100),
        description: 'Test travel description',
        numberOfDays: 10,
      });

      const toursIds = await Promise.all([
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-02-01'),
          endingDate: new Date('2030-03-01'),
          price: 100000,
          travel: travelId,
        }),
        toursRepo.nativeInsert({
          name: faker.random.alpha(100),
          startingDate: new Date('2030-04-01'),
          endingDate: new Date('2030-05-01'),
          price: 50000,
          travel: travelId,
        }),
      ]);

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              toursByTravel(travelSlug: "${slug}", limit: 10, offset: 0, sortBy: PRICE_ASC) {
                items {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.toursByTravel.items).toHaveLength(2);
          expect(res.body.data.toursByTravel.items[0].id).toBe(toursIds[1]);
          expect(res.body.data.toursByTravel.items[1].id).toBe(toursIds[0]);
        });
    });
  });
});
