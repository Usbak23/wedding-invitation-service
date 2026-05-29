import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from '../services/public.service';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Public')
@Controller('api/public')
export class PublicController {
    constructor(private readonly publicService: PublicService) {}

    @Get(':slug')
    @ApiOperation({ summary: 'Halaman publik undangan berdasarkan slug' })
    async getBySlug(@Param('slug') slug: string, @Req() req: Request) {
        const data = await this.publicService.getBySlug(slug, req);
        return successResponse(data);
    }

    @Get(':slug/guests/:code')
    @ApiOperation({ summary: 'Data tamu personal berdasarkan kode undangan' })
    async getGuestByCode(@Param('slug') slug: string, @Param('code') code: string) {
        const data = await this.publicService.getGuestByCode(slug, code);
        return successResponse(data);
    }

    @Get(':slug/rsvps')
    @ApiOperation({ summary: 'List RSVP publik per undangan' })
    async getRsvps(@Param('slug') slug: string) {
        const data = await this.publicService.getRsvps(slug);
        return successResponse(data);
    }
}
