import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { ProjectDTO } from '../dto/project.dto';
import { Project } from '../project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  createProject(
    ProjectDTO: ProjectDTO,
    user: Omit<User, 'password'>,
  ): Promise<Project> {
    if (user.role === 'Admin') {
      const project = new Project();
      project.name = ProjectDTO.name;
      project.referringEmployeeId = ProjectDTO.referringEmployeeId;
      return this.projectRepository.save(project);
    } else {
      throw new UnauthorizedException();
    } /* else if (user.role === 'ProjectManager') {
    } */
  }
}
