import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from '../base-route';

export class DayTwoPartOneTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'users');
  }

  routeTest() {
    describe('route', () => {
      beforeAll(async () => {
        await this.createAllUsers();
      });
      describe('users', () => {
        // Get Users
        describe('get /users/', () => {
          it('should return 401', (): any => {
            return this.customGetWithoutAccessToken('').expectStatus(401);
          });
          this.itu('should return 200', async () => {
            return this.find()
              .expectStatus(200)
              .expectJsonSchema({
                type: 'array',
                items: {
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
                },
              });
          });
        });
        // Get Users id
        describe('get /users/{id}', () => {
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
