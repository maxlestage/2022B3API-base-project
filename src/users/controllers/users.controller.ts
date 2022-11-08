import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe, ValidationPipe, UsePipes,
} from '@nestjs/common';
import { User } from '../user.entity';
import { LoginUserDTO,SignupUserDTO } from '../dto/user.dto';
import { UsersService } from '../services/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post('/auth/sign-up')
  @UsePipes(ValidationPipe)
  async signup(@Body() SignupUserDTO: SignupUserDTO): Promise<SignupUserDTO> {
    return await this.usersService.createUser(SignupUserDTO);
  }

/*  // POST users/auth/login
  @Post("/auth/login")
  // UsePipes(ValidationPipe)
  async login(@Body() LoginUserDTO: LoginUserDTO): Promise<LoginUserDTO> {
    return await this.usersService.createUser(LoginUserDTO);
  }*/

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

}
