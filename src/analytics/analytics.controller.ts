import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  overview() {
    return this.analyticsService.overview();
  }

  @Get('top-events')
  topEvents(@Query('limit') limit?: string) {
    return this.analyticsService.topEvents(limit ? parseInt(limit, 10) : 5);
  }

  @Get('top-institutions')
  topInstitutions(@Query('limit') limit?: string) {
    return this.analyticsService.topInstitutions(
      limit ? parseInt(limit, 10) : 5,
    );
  }

  @Get('my/stats')
  myStats(@GetUser('id') userId: string) {
    return this.analyticsService.myStats(userId);
  }

  @Get('my/events')
  myEvents(@GetUser('id') userId: string, @Query('limit') limit?: string) {
    return this.analyticsService.myEvents(
      userId,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
