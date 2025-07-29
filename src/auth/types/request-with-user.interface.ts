import { Request } from 'express';
import { JwtPayloadWithUser } from './jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayloadWithUser;
}
