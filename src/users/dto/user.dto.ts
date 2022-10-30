import { Roles } from '../user.entity';

export class UserDto {
  username: string;
  email: string;
  password: string;
  role: Roles;
}
