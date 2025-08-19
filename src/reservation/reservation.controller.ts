import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReservationService } from './reservation.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':eventId')
  create(@GetUser('id') userId: string, @Param('eventId') eventId: string) {
    return this.reservationService.create(userId, eventId);
  }

  @Delete(':eventId')
  remove(@GetUser('id') userId: string, @Param('eventId') eventId: string) {
    return this.reservationService.remove(userId, eventId);
  }

  @Get('me')
  mine(@GetUser('id') userId: string) {
    return this.reservationService.listMine(userId);
  }

  @Get(':eventId/status')
  status(@GetUser('id') userId: string, @Param('eventId') eventId: string) {
    return this.reservationService.isReserved(userId, eventId);
  }
}
