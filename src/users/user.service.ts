import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(UserDto: UserDto): Promise<User> {
    const user = new User();
    user.username = UserDto.username;
    user.email = UserDto.email;
    user.password = UserDto.password;
    user.role = UserDto.role;
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id.toString() });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
