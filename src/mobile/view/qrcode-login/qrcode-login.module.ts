import { Module } from '@nestjs/common';
import { QrcodeLoginController } from './qrcode-login.controller';
import { QrcodeLoginService } from './qrcode-login.service';

// https://zhuanlan.zhihu.com/p/655152882
@Module({
    imports: [],
    controllers: [QrcodeLoginController],
    providers: [QrcodeLoginService],
    exports: [],
})
export class QrcodeLoginModule {}
