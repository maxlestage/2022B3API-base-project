import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/project.module';
import { UsersModule } from '../users/user.module';
import { ProjectUserController } from './controllers/projectsUser.controller';
import { ProjectUser } from './projectUser.entity';
import { ProjectUserService } from './services/projectUser.service';
// import { ProjectsController } from './controllers/projects.controller';
// import { Project } from './project.entity';
// import { ProjectsService } from './services/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectsModule),
  ],
  providers: [ProjectUserService],
  controllers: [ProjectUserController],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
