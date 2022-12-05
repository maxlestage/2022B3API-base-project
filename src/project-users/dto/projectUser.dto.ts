import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ProjectUserDTO {
  @IsNotEmpty()
  @IsDate()
  startDate!: Date;

  @IsNotEmpty()
  @IsDate()
  endDate!: Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId!: string; //au format uuidv4

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId!: string; //au format uuidv4
}
