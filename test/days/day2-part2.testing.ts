import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from '../base-route';

export class DayTwoPartTwoTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'projects');
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
      describe('projects', () => {
        // post projects/
        describe('Post projects/ ', () => {
          it('should throw error because no access token', async () => {
            await this.customPostWithoutAccessToken('')
              .expectStatus(401)
              .expectBodyContains('Unauthorized');
          });
          this.itu('should return 401 with user role', async () => {
            await this.create().withJson(createProjectDto).expectStatus(401);
          });
          this.itm('should return 401 with project manager role', async () => {
            await this.create().withJson(createProjectDto).expectStatus(401);
          });
          this.ita(
            'should return 201 with project and referring Employee ',
            async () => {
              await this.create().withJson(createProjectDto).expectStatus(201);
            },
          );
          this.ita(
            'should return 401 if referringEmployee is not at least manager ',
            async () => {
              await this.create()
                .withJson({
                  name: createProjectDto.name,
                  referringEmployeeId: this.userId,
                })
                .expectStatus(401);
            },
          );
        });

        // Get projects/
        describe('Get projects/ ', () => {
          const projects: Record<string, unknown>[] = [];
          let projectUser: Record<string, unknown>;
          beforeAll(async () => {
            createProjectDto = {
              name: faker.random.words(5),
              referringEmployeeId: this.projectManagerId,
            };
            await this.setAdminAccessToken();
            projects.push(
              ...(await Promise.all(
                new Array(4).fill(
                  this.create()
                    .withJson(createProjectDto)
                    .expectStatus(201)
                    .returns('res.body'),
                ),
              )),
            );

            const date = faker.date.past();
            projectUser = await this.customPostwithPath('project-users')
              .withJson({
                projectId: projects[0].id,
                userId: this.userId,
                startDate: date,
                endDate: new Date(date.setMonth(date.getMonth() + 1)),
              })
              .expectStatus(201)
              .returns('res.body');
          });
          it('should throw error because no access token', async () => {
            this.customGetWithoutAccessToken('')
              .expectStatus(401)
              .expectBodyContains('Unauthorized');
          });
          this.itu(
            'should return 200 with only project with user in with projects user role',
            async () => {
              const res = (await this.find()
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
                      referringEmployee: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                          },
                          username: {
                            type: 'string',
                          },
                          email: {
                            type: 'string',
                          },
                          role: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                })
                .returns('res.body')) as Record<string, unknown>[];

              expect(res.length).toBe(1);
              expect(res[0].id).toBe(projectUser.projectId);
            },
          );
          this.itm('should return 200 with projects manager role', async () => {
            const res = (await this.find()
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
                    referringEmployee: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        username: {
                          type: 'string',
                        },
                        email: {
                          type: 'string',
                        },
                        role: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              })
              .returns('res.body')) as Record<string, unknown>[];
            expect(res.length).toBeGreaterThanOrEqual(4);
          });
          this.ita('should return 200 with projects admin role ', async () => {
            const res = (await this.find()
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
                    referringEmployee: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        username: {
                          type: 'string',
                        },
                        email: {
                          type: 'string',
                        },
                        role: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              })
              .returns('res.body')) as Record<string, unknown>[];
            expect(res.length).toBeGreaterThanOrEqual(4);
          });
        });

        // get projects/:id
        describe('Get projects/:id ', () => {
          let project: { id: string; [k: string]: unknown };
          beforeAll(async () => {
            createProjectDto = {
              name: faker.random.words(5),
              referringEmployeeId: this.projectManagerId,
            };
            await this.setAdminAccessToken();
            project = await this.create()
              .withJson(createProjectDto)
              .expectStatus(201)
              .returns('res.body');
          });
          it('should throw error because no access token', async () => {
            await this.customGetWithoutAccessToken(project.id)
              .expectStatus(401)
              .expectBodyContains('Unauthorized');
          });
          this.ita(
            'should throw 404 error because project not found',
            async () => {
              await this.findById(
                '7cfd8773-42c3-4b31-aae6-20f7eaa7774b',
              ).expectStatus(404);
            },
          );
          this.itu(
            'should return ForbiddenException because user not in the project with user role',
            async () => {
              await this.findById(project.id)
                .expectStatus(403)
                .expectBodyContains('Forbidden');
            },
          );
          this.itu('should return 200 with project user role', async () => {
            await this.setAdminAccessToken();
            const date = faker.date.past();
            await this.customPostwithPath('project-users')
              .withJson({
                projectId: project.id,
                userId: this.userId,
                startDate: date,
                endDate: new Date(date.setMonth(date.getMonth() + 1)),
              })
              .expectStatus(201);
            await this.setAccessToken();
            await this.findById(project.id)
              .expectStatus(200)
              .expectJsonSchema({
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
              });
          });
          this.itm('should return 200 with project manager role', async () => {
            await this.findById(project.id)
              .expectStatus(200)
              .expectJsonSchema({
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
              });
          });
          this.ita('should return 200 with project admin role ', async () => {
            await this.findById(project.id)
              .expectStatus(200)
              .expectJsonSchema({
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
              });
          });
        });
      });
    });
  }
}
