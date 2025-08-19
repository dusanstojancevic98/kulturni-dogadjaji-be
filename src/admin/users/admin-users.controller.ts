import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminUsersService } from './admin-users.service';
import { CreateUserAdminDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserAdminDto } from './dto/update-user.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Get()
  list(@Query() q: QueryUsersDto) {
    return this.adminUsersService.findMany(q);
  }

  @Post()
  create(@Body() dto: CreateUserAdminDto) {
    return this.adminUsersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserAdminDto) {
    return this.adminUsersService.update(id, dto);
  }

  @Delete(':id')
  delete(@GetUser('id') meId: string, @Param('id') id: string) {
    return this.adminUsersService.remove(id, meId);
  }
}
