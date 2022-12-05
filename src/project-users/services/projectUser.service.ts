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
    private readonly projectUserRepository: Repository<ProjectUser>,
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

  //   Speech client : En tant qu'_Administrateurs_ ou _Chef de projet_, je dois pouvoir assigner un employé à un projet pour une durée determinée si ce dernier n'est pas déja affecté à un autre projet en même temps.

  // _Notes du lead-developper : Dans le cas où l'employé est déjà affecté à un projet pour la période demandé tu dois me renvoyer une ConflictException. Tout comme dans les autres routes, si un utilisateur n'a pas les droits pour effectuer cette action, il faut que tu me renvoies une UnauthorizedException. Pour que le portail puisse afficher une modale de succès, il faudrait que tu m'inclues les relations **user** et **project** dans le retour de la route._

  // ```
  // Parametres (body) :

  // startDate!: Date;
  // endDate!: Date;
  // userId!: string; //au format uuidv4
  // projectId!: string; //au format uuidv4
  // ```

  async assignationUser(
    ProjectUserDTO: ProjectUserDTO,
    user: Omit<User, 'password'>,
  ): Promise<ProjectUser> {
    if (user.role === 'Admin' || 'ProjectManager') {
      if (user.role === 'Employee') {
      }
      const projectAssign = new ProjectUser();
      projectAssign.userId = ProjectUserDTO.userId;
      projectAssign.startDate = ProjectUserDTO.startDate;
      projectAssign.endDate = ProjectUserDTO.endDate;
      return this.projectUserRepository.save(projectAssign);
    }
  }

  // async createProject(
  //   ProjectDTO: ProjectDTO,
  //   user: Omit<User, 'password'>,
  // ): Promise<Project> {
  //   if (user.role === 'Admin') {
  //     if (
  //       (await this.usersService.findOne(ProjectDTO.referringEmployeeId))
  //         .role === ('ProjectManager' || 'Admin')
  //     ) {
  //       const project = new Project();
  //       project.name = ProjectDTO.name;
  //       project.referringEmployeeId = ProjectDTO.referringEmployeeId;
  //       return this.projectRepository.save(project);
  //     } else {
  //       throw new UnauthorizedException();
  //     }
  //   } else {
  //     throw new UnauthorizedException();
  //   }
  // }
}
