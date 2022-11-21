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
  NotFoundException,
} from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { User } from '../user.entity';

// For LoginUserDTO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Show all users when i'm connected
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  // Routes :id/meal-vouchers/:month
  // @Get(':id/meal-vouchers/:month')
  // findByIdMealVouchersPerMonth(
  //   @Param('id', ParseUUIDPipe) id: string,
  // ): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  @UseGuards(JwtAuthGuard)
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
