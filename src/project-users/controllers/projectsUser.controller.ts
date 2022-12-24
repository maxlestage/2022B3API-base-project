import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthService } from '../../auth/services/auth.service';
import { ProjectUserService } from '../services/projectUser.service';
import { ProjectUser } from '../projectUser.entity';
import { ProjectUserDTO } from '../dto/projectUser.dto';
import { ProjectDTO } from '../../projects/dto/project.dto';
import { ProjectsService } from '../../projects/services/project.service';

@Controller('project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private readonly project: ProjectsService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/id')
  async getAssignationUser(@Request() req): Promise<ProjectUser[]> {
    const projects = await this.projectUserService.getAssignation(req.user);
    return projects;
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAssignationUser(@Request() req): Promise<ProjectUser[]> {
    const projects = await this.projectUserService.getAssignation(req.user);
    return projects;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('')
  async createAssignationUser(
    @Body() projectUserDTO: ProjectUserDTO,
    projectDTO: ProjectDTO,
    @Request() req,
  ): Promise<ProjectUserDTO> {
    return await this.projectUserService.assignUserToProject(
      projectUserDTO,
      req.user,
    );
  }
}
