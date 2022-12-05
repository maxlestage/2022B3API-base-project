import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { NestFactory } from '@nestjs/core';

import { DayOneTesting } from './days/day1.testing';
import { DayTwoPartOneTesting } from './days/day2-part1.testing';
import { DayTwoPartTwoTesting } from './days/day2-part2.testing';
import { DayThreeTesting } from './days/day3.testing';
// import { DayFourTesting } from './days/day4.testing';
// import { DayFiveTesting } from './days/day5.testing';
// import { DaySixPartOneTesting } from './days/day6-part1.testing';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { cors: true });
    await app.listen(3000);

    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  // Users tests
  new DayOneTesting(app).routeTest();
  new DayTwoPartOneTesting(app).routeTest();
  new DayTwoPartTwoTesting(app).routeTest();
  new DayThreeTesting(app).routeTest();
  // new DayFourTesting(app).routeTest();
  // new DayFiveTesting(app).routeTest();
  // new DaySixPartOneTesting(app).routeTest();
});
