import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { BaseRouteTesting } from '../base-route';

export class DayFourTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'project-users');
  }

  routeTest() {
    describe('route', () => {
      let createProjectDto: { name?: string; referringEmployeeId?: string } =
        {};
      beforeAll(async () => {
        await this.createAllUsers();
        createProjectDto = {
          name: faker.random.words(5),
          referringEmployeeId: this.projectManagerId,
        };
      });
      describe('project-users', () => {
        let project: Record<string, unknown>;
        beforeEach(async () => {
          await this.setAdminAccessToken();
          await this.createUser();
          project = await this.customPostwithPath('projects/')
            .withJson(createProjectDto)
            .expectStatus(201)
            .returns('res.body');
        });

        // Get project-users/id
        describe('Get project-users/:id ', () => {
          let projectUser: { id: string; [k: string]: unknown };
          beforeEach(async () => {
            const date = faker.date.past();
            projectUser = await this.customPostwithPath('project-users')
              .withJson({
                projectId: project.id,
                userId: this.userId,
                startDate: date,
                endDate: dayjs(date).add(1, 'month').toDate(),
              })
              .expectStatus(201)
              .returns('res.body');
          });
          it('should throw error because no access token', async () => {
            this.customGetWithoutAccessToken(projectUser.id)
              .expectStatus(401)
              .expectBodyContains('Unauthorized');
          });
          this.itu(
            'should throw 404 NotFoundException if user not in project',
            async () => {
              this.findById('7cfd8773-42c3-4b31-aae6-20f7eaa7774b')
                .expectStatus(401)
                .expectBodyContains('Unauthorized');
            },
          );
          this.itm('should return 200 with projects manager role', async () => {
            await this.findById(projectUser.id)
              .expectStatus(200)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  startDate: {
                    type: 'string',
                  },
                  endDate: {
                    type: 'string',
                  },
                  userId: {
                    type: 'string',
                  },
                  projectId: {
                    type: 'string',
                  },
                },
              });
          });
          this.ita('should return 200 with projects admin role ', async () => {
            await this.findById(projectUser.id)
              .expectStatus(200)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  startDate: {
                    type: 'string',
                  },
                  endDate: {
                    type: 'string',
                  },
                  userId: {
                    type: 'string',
                  },
                  projectId: {
                    type: 'string',
                  },
                },
              });
          });
        });

        // get project-users
        describe('Get project-users ', () => {
          let projectUser: Record<string, unknown>;
          beforeEach(async () => {
            const date = faker.date.past();
            await this.createProjectManagers();
            projectUser = await this.customPostwithPath('project-users')
              .withJson({
                projectId: project.id,
                userId: this.projectManager2Id,
                startDate: date,
                endDate: dayjs(date).add(1, 'month').toDate(),
              })
              .expectStatus(201)
              .returns('res.body');
          });
          it('should throw error because no access token', async () => {
            await this.customGetWithoutAccessToken('')
              .expectStatus(401)
              .expectBodyContains('Unauthorized');
          });
          this.ita('should throw 200', async () => {
            await this.find().expectStatus(200);
          });
          this.itu(
            'should return 200 for user but with no project-users',
            async () => {
              const body = (await this.find()
                .expectStatus(200)
                .returns('res.body')) as Record<string, unknown>[];
              expect(body.length).toBe(0);
            },
          );
          this.itu(
            'should return 200 for user but with only his project-users',
            async () => {
              await this.setAdminAccessToken();
              const date = faker.date.past();
              await this.customPostwithPath('project-users')
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate: dayjs(date).add(1, 'month').toDate(),
                })
                .expectStatus(201);
              await this.setAccessToken();
              await this.find()
                .expectStatus(200)
                .expectJsonSchema({
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      referringEmployeeId: {
                        type: 'string',
                      },
                    },
                  },
                });
            },
          );
          this.itm('should return 200 with project manager role', async () => {
            await this.find()
              .expectStatus(200)
              .expectJsonSchema({
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    name: {
                      type: 'string',
                    },
                    referringEmployeeId: {
                      type: 'string',
                    },
                  },
                },
              });
          });
          this.ita('should return 200 with project admin role ', async () => {
            await this.find()
              .expectStatus(200)
              .expectJsonSchema({
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    name: {
                      type: 'string',
                    },
                    referringEmployeeId: {
                      type: 'string',
                    },
                  },
                },
              });
          });
        });
      });
    });
  }
}
