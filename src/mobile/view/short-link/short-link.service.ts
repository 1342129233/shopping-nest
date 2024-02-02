import { Injectable } from '@nestjs/common';
import { generateRandomStr } from '@/shared/utils/base62';

@Injectable()
export class ShortLinkService {
    private readonly linkMap = new Map<string, string>(); // 这个可以换成数据库

    async create(originalUrl: string) {
        // 生成一个code
        const str = await generateRandomStr(6);
        this.linkMap.set(str, originalUrl);
        return str;
    }

    async getShort(shortCode: string) {
        const url = await this.linkMap.get(shortCode);
        return url;
    }
}
