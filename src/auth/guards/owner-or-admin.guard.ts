/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { id: string; role: Role } | undefined;
    if (!user) return false;

    if (user.role === 'ADMIN') return true;

    const eventId = req.params?.id as string | undefined;
    if (!eventId) return false;

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { createdById: true },
    });
    if (!event) return false;

    return event.createdById === user.id;
  }
}
