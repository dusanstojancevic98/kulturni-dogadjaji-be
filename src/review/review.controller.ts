import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  create(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
    @Body() body: { rating: number; comment?: string },
  ) {
    return this.reviewService.create(
      userId,
      eventId,
      body.rating,
      body.comment,
    );
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.reviewService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.reviewService.remove(id, userId);
  }
}
