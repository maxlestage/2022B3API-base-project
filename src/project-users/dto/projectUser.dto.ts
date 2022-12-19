import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProjectUserDTO {
  @IsNotEmpty()
  @IsDefined()
  @IsDateString()
  startDate!: Date;

  @IsNotEmpty()
  @IsDefined()
  @IsDateString()
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
