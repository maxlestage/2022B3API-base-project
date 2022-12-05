import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProjectUserDTO {
  @IsNotEmpty()
  @IsDefined()
  @IsDate()
  startDate!: Date;

  @IsNotEmpty()
  @IsDefined()
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
