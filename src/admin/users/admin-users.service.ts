import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAdminDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserAdminDto } from './dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  async findMany(q: QueryUsersDto) {
    const { q: text, role, isActive, page = 1, pageSize = 12 } = q;

    const AND: Prisma.UserWhereInput[] = [];
    if (typeof isActive === 'boolean') AND.push({ isActive });
    if (role) AND.push({ role });
    if (text)
      AND.push({
        OR: [
          { name: { contains: text, mode: 'insensitive' } },
          { email: { contains: text, mode: 'insensitive' } },
        ],
      });

    const where: Prisma.UserWhereInput = AND.length ? { AND } : {};

    const [total, items] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ]);

    return { items, total, page, pageSize };
  }

  async create(data: CreateUserAdminDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new BadRequestException('Email je zauzet');
    const password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserAdminDto) {
    if (data.email) {
      const exists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (exists && exists.id !== id)
        throw new BadRequestException('Email je zauzet');
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string, meId: string) {
    if (id === meId)
      throw new BadRequestException('Ne možete obrisati svoj nalog');
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
