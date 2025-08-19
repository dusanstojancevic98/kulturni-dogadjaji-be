import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [users, events, reservations, favorites] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.event.count(),
        this.prisma.reservation.count(),
        this.prisma.favorite.count(),
      ]);
    return { users, events, reservations, favorites };
  }

  async topEvents(limit = 5) {
    const items = await this.prisma.event.findMany({
      take: limit,
      orderBy: [{ reservations: { _count: 'desc' } }, { dateTime: 'asc' }],
      select: {
        id: true,
        title: true,
        dateTime: true,
        capacity: true,
        imageUrl: true,
        institution: { select: { id: true, name: true } },
        _count: { select: { reservations: true, favorites: true } },
      },
    });
    return items;
  }

  async topInstitutions(limit = 5) {
    const items = await this.prisma.institution.findMany({
      take: limit,
      orderBy: [{ events: { _count: 'desc' } }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        type: true,
        imageUrl: true,
        _count: { select: { events: true } },
      },
    });
    return items;
  }

  async myStats(userId: string) {
    const [events, reservations, favorites] = await this.prisma.$transaction([
      this.prisma.event.count({ where: { createdById: userId } }),
      this.prisma.reservation.count({
        where: { event: { createdById: userId } },
      }),
      this.prisma.favorite.count({ where: { event: { createdById: userId } } }),
    ]);
    return { events, reservations, favorites };
  }

  async myEvents(userId: string, limit = 10) {
    const items = await this.prisma.event.findMany({
      where: { createdById: userId },
      take: limit,
      orderBy: [{ dateTime: 'asc' }],
      select: {
        id: true,
        title: true,
        dateTime: true,
        capacity: true,
        _count: { select: { reservations: true, favorites: true } },
      },
    });
    return items;
  }
}
