import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
