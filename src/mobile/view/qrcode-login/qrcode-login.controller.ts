import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto'; // crypto 是 Node.js 的核心模块之一，提供了加密算法的支持，包括哈希、摘要、签名、加密等。
import * as qrcode from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { QrcodeLoginService } from './qrcode-login.service';

const map = new Map<string, QrCodeInfo>();
// noscan 未扫描
// scan-wait-confirm 已扫描,等待用户确认
// scan-confirm 已扫描,用户同意授权
// scan-cancel 已扫描,用户取消授权
// expired 已过期
interface QrCodeInfo {
    status: 'noscan' | 'scan-wait-confirm' | 'scan-confirm' | 'scan-cancel' | 'expired';
    userInfo?: {
        userId: number;
    }
}

@Controller('qrcode-login')
export class QrcodeLoginController {
    constructor(
        private readonly qrcodeLoginService: QrcodeLoginService,
    ) {}

    @Get('hello')
    getHello(): string {
        return this.qrcodeLoginService.getHello();
    }

    // 生成二维码并返回
    @Get('qrcode/generate')
    async generate() {
        // 这里用 node 的 crypto 模块生成一个随机的 uuid
        const uuid = randomUUID();
        // qrcode 生成二维码，只不过转成 base64 返回 await qrcode.toDataURL(uuid); // http://localhost:3000/pages/index.html 会看到二维码
        // 判断是 APP 打开的还是其他方式打开的，分别会显示不同的内容 电脑ip: 192.168.31.56
        const dataUrl = await qrcode.toDataURL(`http://192.168.31.56/pages/confirm.html?id=${uuid}`); // 扫码就会打开这个页面，而这个页面就是登录确认页面

        map.set(`qrcode_${uuid}`, {
            status: 'noscan'
        })
        return {
            qrcode_id: uuid,
            img: dataUrl,
            id: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Indhbmd4aW4iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTcwNzM3MzU4NiwiZXhwIjoxNzA3NDU5OTg2fQ.oVOGMJT32e9GwL6ZRPTG4ZA-Nadv49-9TMVFgYuCiOU'
        }
    }

    // 检查二维码状态
    @Get('qrcode/check')
    async check(@Query('id') id: string) {
        const info = map.get(`qrcode_${id}`);
        return {
            result: 1,
            status: info.status
        }
    }

    // 扫码
    @Get('qrcode/scan')
    async scan(@Query('id') id: string) {
        const info = map.get(`qrcode_${id}`);
        if(!info) {
            throw new BadRequestException('二维码已过期');
        }
        info.status = 'scan-wait-confirm';
        return {
            result: 1,
            status: info.status
        }
    }

    // 确认授权
    @Get('qrcode/confirm')
    async confirm(@Query('id') id: string) {
        const info = map.get(`qrcode_${id}`);
        if(!info) {
            throw new BadRequestException('二维码已过期');
        }
        info.status = 'scan-confirm';
        return {
            result: 1,
            status: info.status
        }
    }

    // 取消授权
    @Get('qrcode/cancel')
    async cancel(@Query('id') id: string) {
        const info = map.get(`qrcode_${id}`);
        if(!info) {
            throw new BadRequestException('二维码已过期');
        }
        info.status = 'scan-cancel';
        return {
            result: 1,
            status: info.status
        }
    }
}
