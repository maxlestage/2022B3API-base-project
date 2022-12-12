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
  async getAssignationUser(@Request() req): Promise<ProjectUser[]> {
    const projects = await this.projectUserService.getAssignation(req.user);
    return projects;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('')
  async createAssignationUser(
    @Body() ProjectUserDTO: ProjectUserDTO,
    @Request() req,
  ): Promise<ProjectUserDTO> {
    return await this.projectUserService.createAssignationUser(
      ProjectUserDTO,
      req.user,
    );
  }
}