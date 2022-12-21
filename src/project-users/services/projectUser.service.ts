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

  //   Speech client : En tant qu'_Administrateurs_ ou _Chef de projet_, je dois pouvoir assigner un employé à un projet pour une durée determinée si ce dernier n'est pas déja affecté à un autre projet en même temps.

  // _Notes du lead-developper : Dans le cas où l'employé est déjà affecté à un projet pour la période demandé tu dois me renvoyer une ConflictException. Tout comme dans les autres routes, si un utilisateur n'a pas les droits pour effectuer cette action, il faut que tu me renvoies une UnauthorizedException. Pour que le portail puisse afficher une modale de succès, il faudrait que tu m'inclues les relations **user** et **project** dans le retour de la route._

  // ```
  // Parametres (body) :

  // startDate!: Date;
  // endDate!: Date;
  // userId!: string; //au format uuidv4
  // projectId!: string; //au format uuidv4
  // ```

  async createAssignationUser(
    projectUserDTO: ProjectUserDTO,
    user: Omit<User, 'password'>,
  ): Promise<ProjectUser> {
    if (user.role === 'Employee') {
      throw new UnauthorizedException();
    }

    if (
      !(await this.projectUserRepository.findOneBy({
        projectId: projectUserDTO.projectId,
      }))
    ) {
      throw new NotFoundException();
    }

    if (
      !(await this.projectUserRepository.findOneBy({
        userId: projectUserDTO.userId,
      }))
    ) {
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
