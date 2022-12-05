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

@Controller('project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getProject(@Request() req): Promise<ProjectUser[]> {
    const projects = await this.projectUserService.getProject(req.user);
    return projects;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Request() req): Promise<ProjectUser> {
    const projects = await this.projectUserService.getProjectById(req.user);
    return projects;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('')
  // async findAll(): Promise<Project[]> {
  //   // console.log('%f', JwtAuthGuard);
  //   const projects = await this.projectsService.findAll();
  //   return projects;
  // }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('')
  async create(
    @Body() ProjectUserDTO: ProjectUserDTO,
    @Request() req,
  ): Promise<ProjectUserDTO> {
    return await this.projectUserService.createProject(ProjectDTO, req.user);
  }
}
