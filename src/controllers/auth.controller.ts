import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../validators/auth.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Register user baru' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return successResponse(data, 'Registration successful');
  }

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'Login dan dapatkan JWT token' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return successResponse(data, 'Login successful');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get data user yang sedang login' })
  async me(@Req() req: any) {
    const data = await this.authService.me(req.user.id);
    return successResponse(data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout user' })
  async logout() {
    return successResponse(null, 'Logout successful');
  }
}
