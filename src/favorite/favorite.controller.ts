import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('me')
  async mine(@GetUser('id') userId: string) {
    return this.favoriteService.listMineIds(userId);
  }

  @Get('my')
  async my(@GetUser('id') userId: string) {
    return this.favoriteService.getUserFavorites(userId);
  }

  @Post(':eventId/toggle')
  async toggle(
    @GetUser('id') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.favoriteService.toggle(userId, eventId);
  }
}
