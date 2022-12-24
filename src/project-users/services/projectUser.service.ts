import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services/user.service';
import { ProjectsService } from '../../projects/services/project.service';
import { User } from '../../users/user.entity';
import { ProjectUserDTO } from '../dto/projectUser.dto';
import { ProjectUser } from '../projectUser.entity';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
// import { Project } from '../../projects/project.entity';

dayjs.extend(isBetween);

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async getAssignation(user: Omit<User, 'password'>): Promise<ProjectUser[]> {
    if (user.role === 'Admin' || user.role === 'ProjectManager') {
      return this.projectUserRepository.find();
    } else if (user.role === 'Employee') {
      const projectUsers = await this.projectUserRepository.findBy({
        userId: user.id,
      });

      if (!projectUsers || projectUsers.length === 0) {
        throw new NotFoundException(
          'No project-user assignments found for user',
        );
      }

      return projectUsers;
    } else {
      throw new UnauthorizedException();
    }
  }

  async getAssignationById(
    id: string,
    user: Omit<User, 'password'>,
  ): Promise<ProjectUser> {
    const projectUser = await this.projectUserRepository.findOneById(id);

    if (user.role === 'Employee') {
      throw new UnauthorizedException();
    }
    if (!projectUser) {
      throw new NotFoundException('Project-user assignment not found');
    }
    return projectUser;
  }

  async assignUserToProject(
    projectUserDTO: ProjectUserDTO,
    user: Omit<User, 'password'>,
  ): Promise<ProjectUser> {
    if (user.role === 'Employee') {
      throw new UnauthorizedException();
    }

    const [projects, users] = await Promise.all([
      this.projectsService.findAll(),
      this.usersService.findAll(),
    ]);

    if (!users.find((user) => user.id === projectUserDTO.userId)) {
      throw new NotFoundException('User not found');
    }
    if (!projects.find((project) => project.id === projectUserDTO.projectId)) {
      throw new NotFoundException('Project not found');
    }

    const existingProjectAssignments: ProjectUser[] =
      await this.projectUserRepository.findBy({
        userId: projectUserDTO.userId,
      });

    if (
      existingProjectAssignments.some((assignment) => {
        return (
          dayjs(projectUserDTO.startDate).isBetween(
            assignment.startDate,
            assignment.endDate,
            'day',
            '[)',
          ) ||
          dayjs(projectUserDTO.endDate).isBetween(
            assignment.startDate,
            assignment.endDate,
            'day',
            '(]',
          ) ||
          (dayjs(projectUserDTO.startDate).isBefore(assignment.startDate) &&
            dayjs(projectUserDTO.endDate).isAfter(assignment.endDate))
        );
      })
    ) {
      throw new ConflictException('Conflicting assignment period');
    }

    const projectAssignment = new ProjectUser();
    projectAssignment.userId = projectUserDTO.userId;
    projectAssignment.projectId = projectUserDTO.projectId;
    projectAssignment.startDate = projectUserDTO.startDate;
    projectAssignment.endDate = projectUserDTO.endDate;

    return await this.projectUserRepository.save(projectAssignment);
  }
}
