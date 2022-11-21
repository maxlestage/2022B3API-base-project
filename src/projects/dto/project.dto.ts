import {} from '../project.entity';
import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class ProjectDTO {
  @IsNotEmpty()
  @MinLength(8)
  name!: string;

  @IsNotEmpty()
  @IsUUID()
  referringEmployeeId!: string; //au format uuidv4
}
