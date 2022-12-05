import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/services/user.service';
import { User } from '../../users/user.entity';
import { ProjectUserDTO } from '../dto/projectUser.dto';
import { ProjectUser } from '../projectUser.entity';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectRepository: Repository<ProjectUser>,
    private readonly usersService: UsersService,
  ) {}

  /*   #### GET /project-users

Speech client :

- En tant qu'_Administrateurs_ ou _Chef de projet_, je veux pouvoir voir toutes les assignations des employés aux différents projets.
- En tant qu'_Employé_, je veux pouvoir voir toutes mes assignations aux différents projets. */

  getAssignation(
    ProjectUserDTO: ProjectUserDTO,
    user: Omit<User, 'password'>,
  ): Promise<ProjectUser> {
    if (user.role === 'Admin') {
      if (
        (await this.usersService.findOne(ProjectDTO.referringEmployeeId))
          .role === ('ProjectManager' || 'Admin')
      ) {
        const project = new Project();
        project.name = ProjectDTO.name;
        project.referringEmployeeId = ProjectDTO.referringEmployeeId;
        return this.projectRepository.save(project);
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
