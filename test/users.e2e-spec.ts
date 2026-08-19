import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { cleanDatabase } from './utils/clean-database';
import { initializeTestingApp } from './utils/initialize-testing-app';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await initializeTestingApp();

    dataSource = app.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await cleanDatabase(dataSource);
  });

  describe('POST /', () => {
    it('should create a new user when valid fields', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@email.com',
          password: 'Password1234.',
        })
        .expect(201);
    });

    it('should not create a new user when invalid fields', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          password: 'Password1234.',
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@email.com',
          password: 'invalid',
        })
        .expect(400);
    });

    it('should not let 2 users with same email to be created', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@email.com',
          password: 'Password1234.',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@email.com',
          password: 'Password1234.',
        })
        .expect(409);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
