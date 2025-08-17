import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = await this.signTokens(user);
    await this.userService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Invalid credentials');

    const tokens = await this.signTokens(user);
    await this.userService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );
    return { user, ...tokens };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.signTokens(user);
    await this.userService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );
    return { user, ...tokens };
  }

  private async signTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET') || '',
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }
}
