export interface JwtPayload {
  sub: number;
  email: string;
}

export interface JwtPayloadWithUser extends JwtPayload {
  iat?: number;
  exp?: number;
}
