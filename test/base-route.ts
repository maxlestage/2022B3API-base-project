import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { faker } from '@faker-js/faker';

export class BaseRouteTesting {
  app!: INestApplication;
  pathName!: string;
  accessToken!: string;
  admin!: {
    email: string;
    password: string;
  };
  adminUser: { id: string; [k: string]: unknown };
  adminId!: string;
  user!: {
    email: string;
    password: string;
  };
  userId!: string;
  projectManager!: {
    email: string;
    password: string;
  };
  projectManagerId!: string;
  projectManager2!: {
    email: string;
    password: string;
  };
  projectManager2Id!: string;

  constructor(app: INestApplication, pathName: string) {
    this.pathName = pathName;
    this.app = app;
  }

  routeTest() {
    throw new Error('Not implemented');
  }

  async createAllUsers() {
    await Promise.all([
      this.createAdmin(),
      this.createUser(),
      this.createProjectManagers(),
    ]);
  }

  private async createAdmin() {
    this.admin = {
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };

    this.adminUser = await this.customPostPrivate('users/auth/sign-up')
      .withJson({
        ...this.admin,
        username: faker.internet.userName(),
        role: 'Admin',
      })
      .expectStatus(201)
      .returns('res.body');
    this.adminId = this.adminUser.id;
  }

  public async createUser() {
    this.user = {
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };

    this.userId = await this.customPostPrivate('users/auth/sign-up')
      .withJson({
        ...this.user,
        username: faker.internet.userName(),
      })
      .expectStatus(201)
      .returns('id');
  }

  public async createProjectManagers() {
    this.projectManager = {
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };

    this.projectManager2 = {
      email: faker.internet.email(),
      password: faker.internet.password(10),
    };

    this.projectManagerId = await this.customPostPrivate('users/auth/sign-up')
      .withJson({
        ...this.projectManager,
        username: faker.internet.userName(),
        role: 'ProjectManager',
      })
      .expectStatus(201)
      .returns('id');

    this.projectManager2Id = await this.customPostPrivate('users/auth/sign-up')
      .withJson({
        ...this.projectManager2,
        username: faker.internet.userName(),
        role: 'ProjectManager',
      })
      .expectStatus(201)
      .returns('id');
  }

  protected async setAccessToken() {
    this.accessToken = await this.getAccessToken();
  }

  protected async setAdminAccessToken() {
    this.accessToken = await this.getAdminAccessToken();
  }

  protected async setManagerAccessToken() {
    this.accessToken = await this.getManagerAccessToken();
  }

  protected async setManager2AccessToken() {
    this.accessToken = await this.getManager2AccessToken();
  }

  protected async getAccessToken() {
    return this.customPostPrivate('users/auth/login')
      .withJson(this.user)
      .expectStatus(201)
      .returns('access_token') as unknown as string;
  }

  protected async getAdminAccessToken() {
    return this.customPostPrivate('users/auth/login')
      .withJson(this.admin)
      .expectStatus(201)
      .returns('access_token') as unknown as string;
  }

  protected async getManagerAccessToken() {
    return this.customPostPrivate('users/auth/login')
      .withJson(this.projectManager)
      .expectStatus(201)
      .returns('access_token') as unknown as string;
  }

  protected async getManager2AccessToken() {
    return this.customPostPrivate('users/auth/login')
      .withJson(this.projectManager2)
      .expectStatus(201)
      .returns('access_token') as unknown as string;
  }

  protected findById(id: string) {
    return pactum
      .spec()
      .get(`/${this.pathName}/{id}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected find() {
    return pactum
      .spec()
      .get(`/${this.pathName}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected deleteById(id: string) {
    return pactum
      .spec()
      .delete(`/${this.pathName}/{id}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected updateById(id: string) {
    return pactum
      .spec()
      .patch(`/${this.pathName}/{id}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected create() {
    return pactum
      .spec()
      .post(`/${this.pathName}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customPost(path: string) {
    return pactum
      .spec()
      .post(`/${this.pathName}/${path}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customPostwithPath(path: string) {
    return pactum
      .spec()
      .post(`/${path}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customGet(path: string) {
    return pactum
      .spec()
      .get(`/${this.pathName}/${path}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customGetWithoutAccessToken(path: string) {
    return pactum.spec().get(`/${this.pathName}/${path}`);
  }

  protected customPostWithoutAccessToken(path: string) {
    return pactum.spec().post(`/${this.pathName}/${path}`);
  }
  private customPostPrivate(path: string) {
    return pactum.spec().post(`/${path}`);
  }

  protected customPostById(path: string, id: string) {
    return pactum
      .spec()
      .post(`/${this.pathName}/{id}/${path}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customGetById(path: string, id: string) {
    return pactum
      .spec()
      .get(`/${this.pathName}/{id}/${path}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected itu(name: string, fn: () => Promise<unknown>) {
    it(name, async () => {
      await this.setAccessToken();
      await fn();
    });
  }

  protected ita(name: string, fn: () => Promise<unknown>) {
    it(name, async () => {
      await this.setAdminAccessToken();
      await fn();
    });
  }

  protected itm(name: string, fn: () => Promise<unknown>) {
    it(name, async () => {
      await this.setManagerAccessToken();
      await fn();
    });
  }

  protected itm2(name: string, fn: () => Promise<unknown>) {
    it(name, async () => {
      await this.setManager2AccessToken();
      await fn();
    });
  }
}
