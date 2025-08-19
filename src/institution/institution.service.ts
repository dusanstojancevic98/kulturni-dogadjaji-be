import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { QueryInstitutionsDto } from './dto/query-institution.dto';
import { SelectInstitutionsDto } from './dto/select-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInstitutionDto) {
    return this.prisma.institution.create({ data: dto });
  }

  async findMany(q: QueryInstitutionsDto) {
    const { page = 1, pageSize = 20, q: text, type } = q;

    const AND: Prisma.InstitutionWhereInput[] = [];
    if (text) {
      AND.push({
        OR: [
          { name: { contains: text, mode: 'insensitive' } },
          { description: { contains: text, mode: 'insensitive' } },
          { address: { contains: text, mode: 'insensitive' } },
        ],
      });
    }
    if (type) {
      AND.push({ type: type });
    }

    const where: Prisma.InstitutionWhereInput = AND.length ? { AND } : {};

    const [total, items] = await this.prisma.$transaction([
      this.prisma.institution.count({ where }),
      this.prisma.institution.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { events: true } },
        },
      }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(id: string) {
    const inst = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        _count: { select: { events: true } },
        events: {
          orderBy: { dateTime: 'asc' },
          take: 5,
          select: {
            id: true,
            title: true,
            dateTime: true,
            type: true,
            imageUrl: true,
          },
        },
      },
    });
    if (!inst) throw new NotFoundException('Institution not found');
    return inst;
  }

  async update(id: string, dto: UpdateInstitutionDto) {
    return this.prisma.institution.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.institution.delete({ where: { id } });
    return { ok: true };
  }

  async findAllForSelect(params: SelectInstitutionsDto) {
    const { q, take = 200 } = params;

    const where: Prisma.InstitutionWhereInput | undefined = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const items = await this.prisma.institution.findMany({
      where,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
      take,
    });

    return items;
  }
}
