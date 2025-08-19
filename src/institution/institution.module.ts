import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';

@Module({
  controllers: [InstitutionController],
  providers: [InstitutionService, PrismaService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
