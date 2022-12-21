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
import { Project } from '../../projects/project.entity';

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
    if (user.role === 'Admin' || 'ProjectManager') {
      return this.projectUserRepository.find();
    } else if (user.role === 'Employee') {
      return this.projectUserRepository.findBy({ userId: user.id });
    } else {
      throw new UnauthorizedException();
    }
  }

  async createAssignationUser(
    projectUserDTO: ProjectUserDTO,
    user: Omit<User, 'password'>,
  ): Promise<ProjectUser> {
    if (user.role === 'Employee') {
      throw new UnauthorizedException();
    }

    const findProject: Project[] = await this.projectsService.findAll();
    // console.log('findProject: %o', findProject);

    const projectId: string[] = findProject.map((project) => {
      return project.referringEmployeeId;
    });
    console.log('projectId: %o', projectId);

    if (!findProject) {
      console.log('controlle found findProject, il plante ');
      throw new NotFoundException();
    }

    const findUser: User[] = await this.usersService.findAll();
    // console.log('findUserId: %o', findUser);
    const userId: string[] = findProject.map((user) => {
      return user.id;
    });
    console.log('userId: %o', userId);

    if (!findUser) {
      console.log('controlle found findUser, il plante');
      throw new NotFoundException();
    }

    const existingProjectUser: ProjectUser[] =
      await this.projectUserRepository.findBy({
        userId: projectUserDTO.userId,
      });

    console.log('existingProjectUser : %o', existingProjectUser);

    const allProjectUser = existingProjectUser.map(
      (projectUser: ProjectUser) => {
        return {
          id: projectUser.projectId,
          start: projectUser.startDate,
          end: projectUser.endDate,
          userId: projectUserDTO.userId,
        };
      },
    );
    console.log('toto');
    console.log('allProjectUser : %o', allProjectUser);

    for (let index = 0; index <= allProjectUser.length; index++) {
      console.log('toto');

      if (
        dayjs(projectUserDTO.startDate).isBetween(
          allProjectUser[index].start,
          allProjectUser[index].end,
        )
      ) {
        // throw new ConflictException();
        console.log(
          'Premier cas isBetween %o',
          dayjs(projectUserDTO.startDate).isBetween(
            allProjectUser[index].start,
            allProjectUser[index].end,
          ),
        );
      }
      if (
        dayjs(projectUserDTO.endDate).isBetween(
          allProjectUser[index].start,
          allProjectUser[index].end,
        )
      ) {
        console.log(
          'Second cas isBetween %o',
          dayjs(projectUserDTO.endDate).isBetween(
            allProjectUser[index].start,
            allProjectUser[index].end,
          ),
        );
      }

      if (
        dayjs(projectUserDTO.startDate).isBefore(allProjectUser[index].start)
      ) {
        console.log(
          'Troisième cas isBefore %o',
          dayjs(projectUserDTO.startDate).isBefore(allProjectUser[index].start),
        );
      }

      if (dayjs(projectUserDTO.endDate).isAfter(allProjectUser[index].end)) {
        console.log(
          'Quatrième cas isAfter %o',
          dayjs(projectUserDTO.endDate).isAfter(allProjectUser[index].end),
        );
      }
    }

    const projectAssign = new ProjectUser();
    projectAssign.userId = projectUserDTO.userId;
    projectAssign.projectId = projectUserDTO.projectId;
    projectAssign.startDate = projectUserDTO.startDate;
    projectAssign.endDate = projectUserDTO.endDate;

    return await this.projectUserRepository.save(projectAssign);
  }
}
