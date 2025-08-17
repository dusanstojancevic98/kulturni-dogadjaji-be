import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstitutionsController } from './institution.controller';
import { InstitutionsService } from './institution.service';

@Module({
  controllers: [InstitutionsController],
  providers: [InstitutionsService, PrismaService],
  exports: [InstitutionsService],
})
export class InstitutionModule {}
