import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from '../base-route';
import { faker } from '@faker-js/faker';
import Spec from 'pactum/src/models/Spec';
export class DayOneTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'users');
  }

  routeTest() {
    describe('route', () => {
      const commonEmail = faker.internet.email();
      beforeAll(async () => {
        await this.createAllUsers();
      });
      describe('users', () => {
        describe('post /users/auth/sign-up', () => {
          it('should return 201 (create user with explicit role)', async () => {
            await this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: faker.internet.email(),
                username: faker.internet.userName(),
                password: 'Qwertyuiop123!',
                role: 'ProjectManager',
              })
              .expectStatus(201)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                  role: {
                    type: 'string',
                  },
                },
              });
          });

          it('should return 201', async () => {
            const regexExp =
              /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

            const id = (await this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: commonEmail,
                username: faker.internet.userName(),
                password: 'Qwertyuiop123!',
              })
              .expectStatus(201)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                  role: {
                    type: 'string',
                  },
                },
              })
              .returns('id')) as unknown as string;
            expect(id).toMatch(regexExp);
          });

          it('should return 500 for duplicate key', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: commonEmail,
                username: faker.internet.userName(),
                password: 'Qwertyuiop123!',
              })
              .expectStatus(500);
          });

          it('should return 400 for email not correct', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: 'test@test',
                username: faker.internet.userName(),
                password: 'Qwertyuiop123!',
              })
              .expectStatus(400)
              .expectBodyContains('email must be an email');
          });

          it('should return 400 because username is mandatory', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: 'test@test2.test',
                password: 'Qwertyuiop123!',
              })
              .expectStatus(400)
              .expectBodyContains('username should not be empty');
          });
        });
        describe('post /users/auth/login', () => {
          it('should return 201', (): any => {
            return this.customPostWithoutAccessToken('auth/login')
              .withJson({
                email: commonEmail,
                password: 'Qwertyuiop123!',
              })
              .expectStatus(201)
              .expectBodyContains('access_token');
          });
          it('should return 401 wrong passsword', (): any => {
            return this.customPostWithoutAccessToken('auth/login')
              .withJson({
                email: commonEmail,
                password: 'Qwertyuiop12!',
              })
              .expectStatus(401);
          });
        });
        // get me
        describe('get /users/me', () => {
          it('should return 401', (): any => {
            return this.customGetWithoutAccessToken('me').expectStatus(401);
          });
          this.itu('should return 200', async () => {
            return this.customGet('me')
              .expectStatus(200)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                  role: {
                    type: 'string',
                  },
                },
              })
              .expectBodyContains(this.user.email);
          });
        });

        // Get Users id
        describe('get /users/:id/meal-vouchers/:month', () => {
          this.itu('should return 400', async () => {
            return this.findById('id').expectStatus(400);
          });
          this.itu('should return 404', async () => {
            return this.findById(
              '187e020c-4c74-4a44-996c-6e8100523413',
            ).expectStatus(404);
          });
          this.itu('should return 200', async () => {
            const id: string = await this.find().returns('[0].id');
            return this.findById(id)
              .expectStatus(200)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                },
              });
          });
        });
      });
    });
  }
}
