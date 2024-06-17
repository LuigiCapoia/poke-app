import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    this.logger.log(`Validating payload: ${JSON.stringify(payload)}`);
    const user = await this.userService.findOne(payload.username);
    if (!user) {
      this.logger.warn(`User not found: ${payload.username}`);
      throw new UnauthorizedException();
    }
    this.logger.log(`User validated: ${payload.username}`);
    return { userId: payload.sub, username: payload.username };
  }
}
