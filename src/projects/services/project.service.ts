import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UsersService } from '../../users/services/user.service';
import { User } from '../../users/user.entity';
import { ProjectDTO } from '../dto/project.dto';
import { ProjectUser } from '../../project-users/projectUser.entity';
import { Project } from '../project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}
  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async createProject(
    ProjectDTO: ProjectDTO,
    user: Omit<User, 'password'>,
  ): Promise<Project> {
    if (user.role === 'Admin') {
      if (
        (await this.usersService.findOne(ProjectDTO.referringEmployeeId))
          .role === ('ProjectManager' || 'Admin')
      ) {
        const project = new Project();
        project.name = ProjectDTO.name;
        project.referringEmployeeId = ProjectDTO.referringEmployeeId;
        return this.projectRepository.save(project);
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async getProject(user: Omit<User, 'password'>): Promise<Project[]> {
    if (user.role === 'ProjectManager' || user.role === 'Admin') {
      return this.projectRepository.find();
    } else if (user.role === 'Employee') {
      const projectUsers: ProjectUser[] =
        await this.projectUserRepository.findBy({
          userId: user.id,
        });
      const projectIds: string[] = projectUsers.map(
        (projectUser) => projectUser.projectId,
      );
      return this.projectRepository.findBy({ id: In(projectIds) });
    } else {
      throw new UnauthorizedException();
    }
  }

  async getProjectById(
    id: string,
    user: Omit<User, 'password'>,
  ): Promise<Project> {
    if (user.role === 'Admin' || user.role === 'ProjectManager') {
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project;
    } else if (user.role === 'Employee') {
      const projectUser = await this.projectUserRepository.findOne({
        where: {
          projectId: id,
          userId: user.id,
        },
      });
      if (!projectUser) {
        throw new ForbiddenException('Project not found');
      }
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project;
    } else {
      throw new UnauthorizedException();
    }
  }
}
