import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  UnauthorizedException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectUserService } from '../services/projectUser.service';
import { ProjectUser } from '../projectUser.entity';
import { ProjectUserDTO } from '../dto/projectUser.dto';
import { ProjectDTO } from '../../projects/dto/project.dto';

@Controller('project-users')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAssignationById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ProjectUserDTO> {
    try {
      const projectUser = await this.projectUserService.getAssignationById(
        id,
        req.user,
      );
      if (req.user.role === 'Employee' && projectUser.userId !== req.user.id) {
        throw new UnauthorizedException();
      }
      return projectUser;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAssignationUser(@Request() req): Promise<ProjectUser[]> {
    try {
      const projectUsers = await this.projectUserService.getAssignation(
        req.user,
      );
      return projectUsers;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return [];
      } else {
        throw error;
      }
    }
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
