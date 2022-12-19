import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services/user.service';
import { User } from '../../users/user.entity';
import { ProjectDTO } from '../dto/project.dto';
import { Project } from '../project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
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
    if (user.role === ('ProjectManager' || 'Admin')) {
      return this.projectRepository.find();
    } else if (user.role !== ('ProjectManager' || 'Admin')) {
      return this.projectRepository.findBy({ id: user.id });
    } else {
      throw new UnauthorizedException();
    }
  }

  getProjectById(user: Omit<User, 'password'>): Promise<Project> {
    if (user.role === ('ProjectManager' || 'Admin')) {
      return this.projectRepository.findOneBy({
        id: user.id,
      });
    } else if (user.role !== ('ProjectManager' || 'Admin')) {
      return this.projectRepository.findOneBy({
        id: user.id,
      });
    } else {
      throw new UnauthorizedException();
    }
  }
}
