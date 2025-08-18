import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, eventId: string) {
    const exists = await this.prisma.favorite.findUnique({
      where: { userId_eventId: { userId, eventId } },
      select: { id: true },
    });

    if (exists) {
      await this.prisma.favorite.delete({
        where: { userId_eventId: { userId, eventId } },
      });
      return { favorited: false };
    }

    await this.prisma.favorite.create({
      data: { userId, eventId },
    });
    return { favorited: true };
  }

  async listMineIds(userId: string) {
    const rows = await this.prisma.favorite.findMany({
      where: { userId },
      select: { eventId: true },
    });
    return { eventIds: rows.map((r) => r.eventId) };
  }
}
