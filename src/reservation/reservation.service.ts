import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, eventId: string) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          capacity: true,
          _count: { select: { reservations: true } },
        },
      });
      if (!event) throw new BadRequestException('Događaj ne postoji');

      if (event._count.reservations >= event.capacity) {
        throw new BadRequestException('Kapacitet je popunjen');
      }
      return tx.reservation.create({
        data: { userId, eventId },
      });
    });
  }

  async remove(userId: string, eventId: string) {
    await this.prisma.reservation.delete({
      where: { userId_eventId: { userId, eventId } },
    });
    return { ok: true };
  }

  async listMine(userId: string) {
    const rows = await this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        event: {
          select: {
            id: true,
            title: true,
            dateTime: true,
            imageUrl: true,
            type: true,
          },
        },
        createdAt: true,
      },
    });
    return rows;
  }

  async isReserved(userId: string, eventId: string) {
    const res = await this.prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId } },
      select: { id: true },
    });
    return { reserved: !!res };
  }
}
