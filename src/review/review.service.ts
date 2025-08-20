import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    eventId: string,
    rating: number,
    comment?: string,
  ) {
    return this.prisma.review.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { rating, comment },
      create: { userId, eventId, rating, comment },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.review.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) return null;
    if (review.userId !== userId) throw new ForbiddenException();
    return this.prisma.review.delete({ where: { id } });
  }
}
