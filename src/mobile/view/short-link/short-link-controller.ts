import { Controller, Get, Post, Param, Body, Headers } from '@nestjs/common';
import { ShortLinkService } from './short-link.service';

@Controller('short-link')
export class ShortLinkController {
    constructor(private readonly shortLinkService: ShortLinkService) {}

    @Post('shortCode')
    async shortCode() {
        const res = await this.shortLinkService.create('/short-link/shortCode');
        return {
            data: res
        }        
    }

    @Get(":shortCode")
    async getShortLink(@Param('shortCode') shortCode: string) {
        const res = await this.shortLinkService.getShort(shortCode);
        return {
            data: res
        }        
    }
}

