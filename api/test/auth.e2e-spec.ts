import faker from '@faker-js/faker';
import { EntityRepository } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { Role, User } from '../src/users/entities/user.entity';
import { Teardown, testSetup } from './test-utils';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let usersRepo: EntityRepository<User>;
  let teardown: Teardown;

  beforeEach(async () => {
    ({ app, usersRepo, teardown } = await testSetup());
  });

  afterEach(async () => {
    await teardown();
  });

  describe('login', () => {
    test('invalid data', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'invalid' })
        .expect(401);
    });

    test('non existing user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'not-found@test.com', password: '123456' })
        .expect(401);
    });

    test('wrong password', async () => {
      const email = faker.internet.email();

      await usersRepo.nativeInsert({
        email,
        password: '123456',
        role: Role.ADMIN,
      });

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password: 'wrong' })
        .expect(401);
    });

    test('success', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);

      await usersRepo.nativeInsert({
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      // expect(res.body).toHaveProperty('refresh_token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.role).toBe(Role.ADMIN);
    });
  });
});
