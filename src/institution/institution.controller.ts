import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { QueryInstitutionsDto } from './dto/query-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InstitutionService } from './institution.service';

import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SelectInstitutionsDto } from './dto/select-institution.dto';

@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionsService: InstitutionService) {}

  @Get()
  async findMany(@Query() q: QueryInstitutionsDto) {
    return this.institutionsService.findMany(q);
  }

  @Get('select')
  async select(@Query() query: SelectInstitutionsDto) {
    return this.institutionsService.findAllForSelect(query);
  }

  @Get('near')
  async near(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    if (!lat || !lng) {
      throw new BadRequestException('lat i lng su obavezni parametri');
    }
    const latN = parseFloat(lat);
    const lngN = parseFloat(lng);
    const r = radiusKm ? parseInt(radiusKm, 10) : 10;
    return this.institutionsService.near(latN, lngN, r);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.institutionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  async create(@Body() dto: CreateInstitutionDto) {
    return this.institutionsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ORGANIZER)
  async update(@Param('id') id: string, @Body() dto: UpdateInstitutionDto) {
    return this.institutionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }
}
