import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { FavoriteModule } from './favorite/favorite.module';
import { InstitutionModule } from './institution/institution.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    EventModule,
    InstitutionModule,
    ReservationModule,
    FavoriteModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
