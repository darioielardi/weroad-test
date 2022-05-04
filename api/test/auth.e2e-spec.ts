import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // orm.getSchemaGenerator().refreshDatabase();
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
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin1@test.com', password: 'wrong' })
        .expect(401);
    });

    test('success', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin1@test.com', password: 'password' })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
