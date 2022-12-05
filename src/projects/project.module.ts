import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { ProjectsController } from './controllers/projects.controller';
import { Project } from './project.entity';
import { ProjectsService } from './services/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
