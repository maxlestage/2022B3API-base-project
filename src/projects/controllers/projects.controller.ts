import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthService } from '../../auth/services/auth.service';
import { Project } from '../project.entity';
import { ProjectsService } from '../services/project.service';
import { ProjectDTO } from '../dto/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService /* usersService: UsersService, */,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Project[]> {
    const projects = await this.projectsService.findAll();
    return projects;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body() ProjectDTO: ProjectDTO): Promise<ProjectDTO> {
    return await this.projectsService.createProject(ProjectDTO);
  }
}
