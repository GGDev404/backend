import { Controller, Post, Body, Get, Param, NotFoundException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../models/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl',multerConfig))
  async create(
    @Body() user: User,
    @UploadedFile() imageUrl: Express.Multer.File
): Promise<User> {
  if (imageUrl) {
    user.imageUrl = imageUrl.filename;
  }
    return this.userService.create(user);
  }

  @Get(':email')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}