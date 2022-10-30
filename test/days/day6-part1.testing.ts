import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from '../base-route';
import * as dayjs from 'dayjs';

export class DaySixPartOneTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'events');
  }

  // @TODO CHIFFREMENT PASSWORD
  // @TODO check if password is return
  routeTest() {
    describe('route', () => {
      describe('Get events/id/validate', () => {
        let event: { id: string; [k: string]: unknown };
        let project: Record<string, unknown>;
        let projectUser: Record<string, unknown>;
        beforeEach(async () => {
          await this.createAllUsers();
          await this.setAdminAccessToken();
          project = await this.customPostwithPath('projects/')
            .withJson({
              name: faker.random.words(5),
              referringEmployeeId: this.projectManagerId,
            })
            .expectStatus(201)
            .returns('res.body');

          projectUser = await this.customPostwithPath('project-users/')
            .withJson({
              projectId: project.id,
              userId: this.userId,
              startDate: dayjs().startOf('week').toDate(),
              endDate: dayjs().startOf('week').add(1, 'month').toDate(),
            })
            .expectStatus(201)
            .returns('res.body');

          await this.setAccessToken();
          event = await this.create()
            .withJson({
              date: dayjs().startOf('week').toDate(),
              eventDescription: faker.random.words(5),
              eventType: 'PaidLeave',
            })
            .expectStatus(201)
            .returns('res.body');
        });

        this.itu('should return 401 with employee role', async () => {
          const res: any = await this.customPostById('validate', event.id);
          expect(res.statusCode).toBe(401);
        });

        this.ita('should return 200 or 201 with admin role', async () => {
          const res: any = await this.customPostById('validate', event.id);
          expect([200, 201].includes(res.statusCode)).toBe(true);
        });

        this.itm('should return 200 or 201 with manager 1 role', async () => {
          const res: any = await this.customPostById('validate', event.id);
          expect([200, 201].includes(res.statusCode)).toBe(true);
        });

        this.itm2('should return 401 with manager 2 role', async () => {
          const res: any = await this.customPostById('validate', event.id);
          expect(res.statusCode).toBe(401);
        });
      });

      describe('Get events/id/decline', () => {
        let event: { id: string; [k: string]: unknown };
        let project: Record<string, unknown>;
        let projectUser: Record<string, unknown>;
        beforeEach(async () => {
          await this.createAllUsers();
          await this.setAdminAccessToken();
          project = await this.customPostwithPath('projects/')
            .withJson({
              name: faker.random.words(5),
              referringEmployeeId: this.projectManagerId,
            })
            .expectStatus(201)
            .returns('res.body');

          projectUser = await this.customPostwithPath('project-users/')
            .withJson({
              projectId: project.id,
              userId: this.userId,
              startDate: dayjs().startOf('week').toDate(),
              endDate: dayjs().startOf('week').add(1, 'month').toDate(),
            })
            .expectStatus(201)
            .returns('res.body');

          await this.setAccessToken();
          event = await this.create()
            .withJson({
              date: dayjs().startOf('week').toDate(),
              eventDescription: faker.random.words(5),
              eventType: 'PaidLeave',
            })
            .expectStatus(201)
            .returns('res.body');
        });

        this.itu('should return 401 with employee role', async () => {
          const res: any = await this.customPostById('decline', event.id);
          expect(res.statusCode).toBe(401);
        });

        this.ita('should return 200 or 201 with admin role', async () => {
          const res: any = await this.customPostById('decline', event.id);
          expect([200, 201].includes(res.statusCode)).toBe(true);
        });

        this.itm('should return 200 or 201 with manager 1 role', async () => {
          const res: any = await this.customPostById('decline', event.id);
          expect([200, 201].includes(res.statusCode)).toBe(true);
        });

        this.itm2('should return 401 with manager 2 role', async () => {
          const res: any = await this.customPostById('decline', event.id);
          expect(res.statusCode).toBe(401);
        });
      });
    });
  }
}
