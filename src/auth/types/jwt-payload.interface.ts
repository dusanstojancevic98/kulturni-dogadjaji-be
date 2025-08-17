export interface JwtPayload {
  sub: number;
  email: string;
  id: string;
  role: string;
}

export interface JwtPayloadWithUser extends JwtPayload {
  iat?: number;
  exp?: number;
}
