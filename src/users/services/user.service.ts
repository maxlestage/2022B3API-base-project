import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { /* LoginUserDTO, */ SignupUserDTO } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  createUser(SignupUserDTO: SignupUserDTO): Promise<User> {
    const user = new User();
    user.username = SignupUserDTO.username;
    user.email = SignupUserDTO.email;
    user.password = SignupUserDTO.password;
    user.role = SignupUserDTO.role;
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
