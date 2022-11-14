import { Roles } from '../user.entity';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class SignupUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  role: Roles;
}
