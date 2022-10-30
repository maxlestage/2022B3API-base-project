import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { BaseRouteTesting } from '../base-route';

export class DayThreeTesting extends BaseRouteTesting {
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
        // post project-users/
        describe('Post project-users/ ', () => {
          it('should throw error because no access token', async () => {
            await this.customPostWithoutAccessToken('')
              .expectStatus(401)
              .expectBodyContains('Unauthorized');
          });
          this.itu(
            'should return 401 UnauthorizedException with user role',
            async () => {
              const date = faker.date.past();
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate: dayjs(date).add(1, 'month').toDate(),
                })
                .expectStatus(401);
            },
          );
          this.ita(
            'should return 404 NotFoundException with project not found',
            async () => {
              const date = faker.date.past();
              await this.create()
                .withJson({
                  projectId: '7cfd8773-42c3-4b31-aae6-20f7eaa7774b',
                  userId: this.userId,
                  startDate: date,
                  endDate: dayjs(date).add(1, 'month').toDate(),
                })
                .expectStatus(404);
            },
          );
          this.ita(
            'should return 404 NotFoundException with user not found',
            async () => {
              const date = faker.date.past();
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: '7cfd8773-42c3-4b31-aae6-20f7eaa7774b',
                  startDate: date,
                  endDate: dayjs(date).add(1, 'month').toDate(),
                })
                .expectStatus(404);
            },
          );
          this.ita('should return 201 admin', async () => {
            const date = faker.date.past();
            await this.create()
              .withJson({
                projectId: project.id,
                userId: this.userId,
                startDate: date,
                endDate: dayjs(date).add(1, 'month').toDate(),
              })
              .expectStatus(201)
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
                  user: {
                    type: 'object',
                  },
                  projectId: {
                    type: 'string',
                  },
                  project: {
                    type: 'object',
                  },
                },
              });
          });
          this.itm('should return 201 manager', async () => {
            const date = faker.date.past();
            await this.create()
              .withJson({
                projectId: project.id,
                userId: this.userId,
                startDate: date,
                endDate: dayjs(date).add(1, 'month').toDate(),
              })
              .expectStatus(201);
          });
          this.ita(
            'should return 409 ConflictException if user already on a project on the same date range',
            async () => {
              const date = faker.date.past();
              const endDate = dayjs(date).add(1, 'month').toDate();
              const project2 = (await this.customPostwithPath('projects/')
                .withJson(createProjectDto)
                .expectStatus(201)
                .returns('res.body')) as Record<string, unknown>;
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate,
                })
                .expectStatus(201);
              await this.create()
                .withJson({
                  projectId: project2.id,
                  userId: this.userId,
                  startDate: date,
                  endDate,
                })
                .expectStatus(409);
            },
          );
          this.ita(
            'should return 409 ConflictException if user already on a project on the same date range 2 ',
            async () => {
              const date = faker.date.past();
              const endDate = dayjs(date).add(1, 'month').toDate();
              const project2 = (await this.customPostwithPath('projects/')
                .withJson(createProjectDto)
                .expectStatus(201)
                .returns('res.body')) as Record<string, unknown>;
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate,
                })
                .expectStatus(201);
              await this.create()
                .withJson({
                  projectId: project2.id,
                  userId: this.userId,
                  startDate: dayjs(date).subtract(1, 'day').toDate(),
                  endDate: dayjs(date).add(1, 'day').toDate(),
                })
                .expectStatus(409);
            },
          );
          this.ita(
            'should return 409 ConflictException if user already on a project on the same date range 3',
            async () => {
              const date = faker.date.past();
              const endDate = dayjs(date).add(1, 'month').toDate();
              const project2 = (await this.customPostwithPath('projects/')
                .withJson(createProjectDto)
                .expectStatus(201)
                .returns('res.body')) as Record<string, unknown>;
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate,
                })
                .expectStatus(201);
              await this.create()
                .withJson({
                  projectId: project2.id,
                  userId: this.userId,
                  startDate: dayjs(date).add(1, 'day').toDate(),
                  endDate: dayjs(endDate).subtract(1, 'day').toDate(),
                })
                .expectStatus(409);
            },
          );
          this.ita(
            'should return 409 ConflictException if user already on a project on the same date range 4',
            async () => {
              const date = faker.date.past();
              const endDate = dayjs(date).add(1, 'month').toDate();
              const project2 = (await this.customPostwithPath('projects/')
                .withJson(createProjectDto)
                .expectStatus(201)
                .returns('res.body')) as Record<string, unknown>;
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate,
                })
                .expectStatus(201);
              await this.create()
                .withJson({
                  projectId: project2.id,
                  userId: this.userId,
                  startDate: dayjs(date).subtract(1, 'day').toDate(),
                  endDate: dayjs(endDate).subtract(1, 'day').toDate(),
                })
                .expectStatus(409);
            },
          );
          this.ita(
            'should return 409 ConflictException if user already on a project on the same date range 5',
            async () => {
              const date = faker.date.past();
              const endDate = dayjs(date).add(1, 'month').toDate();
              const project2 = (await this.customPostwithPath('projects/')
                .withJson(createProjectDto)
                .expectStatus(201)
                .returns('res.body')) as Record<string, unknown>;
              await this.create()
                .withJson({
                  projectId: project.id,
                  userId: this.userId,
                  startDate: date,
                  endDate,
                })
                .expectStatus(201);
              await this.create()
                .withJson({
                  projectId: project2.id,
                  userId: this.userId,
                  startDate: dayjs(date).add(1, 'day').toDate(),
                  endDate: dayjs(endDate).add(1, 'day').toDate(),
                })
                .expectStatus(409);
            },
          );
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
