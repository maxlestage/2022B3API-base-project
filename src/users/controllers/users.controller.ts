import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { User } from '../user.entity';
import { LoginUserDTO, SignupUserDTO } from '../dto/user.dto';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthService } from '../../auth/services/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Routes me
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Request() req): Promise<User> {
    return req.user;
  }

  // Routes ID
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  // Routes auth/
  // signup
  @Post('/auth/sign-up')
  @UsePipes(ValidationPipe)
  async signup(@Body() SignupUserDTO: SignupUserDTO): Promise<SignupUserDTO> {
    return await this.usersService.createUser(SignupUserDTO);
  }

  // login :
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/auth/login')
  async login(
    @Request() req,
    @Body() LoginUserDTO: LoginUserDTO,
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
