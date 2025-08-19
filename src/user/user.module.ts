import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, PrismaModule],
})
export class UserModule {}
