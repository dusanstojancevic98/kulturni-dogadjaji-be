import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnerOrAdminGuard } from 'src/auth/guards/owner-or-admin.guard';
import { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  async findMany(@Query() q: QueryEventsDto) {
    return this.eventsService.findMany(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateEventDto, @Req() req: RequestWithUser) {
    console.log('Creating event with data:', req.user);
    return this.eventsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
