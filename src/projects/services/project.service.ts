import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectDTO } from '../dto/project.dto';
import { Project } from '../project.entity';
/* import {} from '../dto/project.dto'; */

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  createProject(ProjectDTO: ProjectDTO): Promise<ProjectDTO> {
    const project = new Project();
    project.name = ProjectDTO.name;
    project.referringEmployeeId = ProjectDTO.referringEmployeeId;
    return this.projectRepository.save(project);
  }
}
