import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Project } from '../project.entity';
import { ProjectsService } from '../services/project.service';
import { ProjectDTO } from '../dto/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Project> {
    return await this.projectsService.getProjectById(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getProjects(@Request() req): Promise<Project[]> {
    return await this.projectsService.getProject(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('')
  async create(
    @Body() ProjectDTO: ProjectDTO,
    @Request() req,
  ): Promise<ProjectDTO> {
    return await this.projectsService.createProject(ProjectDTO, req.user);
  }
}
