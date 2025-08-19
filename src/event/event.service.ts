import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto, userId: string) {
    console.log('Creating event with data:', dto);
    const institution = await this.prisma.institution.findUnique({
      where: { id: dto.institutionId },
      select: { id: true },
    });
    console.log('Found institution:', institution);
    if (!institution) throw new ForbiddenException('Institution not found');

    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        dateTime: new Date(dto.dateTime),
        type: dto.type,
        capacity: dto.capacity,
        imageUrl: dto.imageUrl,
        createdById: userId,
        institutionId: dto.institutionId,
      },
    });
  }

  async findMany(q: QueryEventsDto) {
    const {
      page = 1,
      pageSize = 12,
      q: text,
      type,
      institutionId,
      createdById,
      from,
      to,
      sort = 'date',
      order = 'asc',
    } = q;

    const AND: Prisma.EventWhereInput[] = [];
    if (text)
      AND.push({
        OR: [
          { title: { contains: text, mode: 'insensitive' } },
          { description: { contains: text, mode: 'insensitive' } },
        ],
      });
    if (type) AND.push({ type });
    if (institutionId) AND.push({ institutionId });
    if (createdById) AND.push({ createdById });
    if (from) AND.push({ dateTime: { gte: new Date(from) } });
    if (to) AND.push({ dateTime: { lte: new Date(to) } });

    const where: Prisma.EventWhereInput = AND.length ? { AND } : {};

    const orderBy: Prisma.EventOrderByWithRelationInput[] = (() => {
      switch (sort) {
        case 'title':
          return [{ title: order }];
        case 'favorites':
          return [{ favorites: { _count: order } }, { dateTime: 'asc' }];
        case 'reservations':
          return [{ reservations: { _count: order } }, { dateTime: 'asc' }];
        case 'date':
        default:
          return [{ dateTime: order }];
      }
    })();

    const [total, items] = await this.prisma.$transaction([
      this.prisma.event.count({ where }),
      this.prisma.event.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          institution: { select: { id: true, name: true } },
          _count: { select: { favorites: true, reservations: true } },
        },
      }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(id: string) {
    return this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            type: true,
            address: true,
            contactEmail: true,
          },
        },
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { favorites: true, reservations: true } },
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        type: dto.type,
        capacity: dto.capacity,
        imageUrl: dto.imageUrl,
        institutionId: dto.institutionId,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.event.delete({ where: { id } });
    return { ok: true };
  }

  async getEventsByUser(userId: string) {
    return this.prisma.event.findMany({
      where: { createdById: userId },
      include: {
        institution: true,
        _count: { select: { reservations: true, favorites: true } },
      },
    });
  }
}
