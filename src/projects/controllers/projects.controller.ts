import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly /* usersService: UsersService, */,
    private /*  authService: AuthService */,
  ) {}
}
