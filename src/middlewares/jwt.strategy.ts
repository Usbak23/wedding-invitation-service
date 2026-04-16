import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

const cookieOrBearerExtractor = (req: Request): string | null => {
    // Try cookie first
    if (req?.cookies?.access_token) return req.cookies.access_token;
    // Fallback to Bearer header
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: cookieOrBearerExtractor,
            secretOrKey: config.get<string>('jwt.secret') as string
        });
    }

    validate(payload: JwtPayload) {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}
