import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { LoginUserDTO,SignupUserDTO } from '../dto/user.dto';

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

  //loginUser(UserDto: UserDto): Promise<User> {}

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
