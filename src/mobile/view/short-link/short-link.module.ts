import { Module } from '@nestjs/common';
import { ShortLinkService } from "./short-link.service";
import { ShortLinkController } from "./short-link-controller";

@Module({
    imports: [],
    controllers: [ShortLinkController],
    providers: [ShortLinkService]
})
export class ShortLinkModule {}

// 如果您将这个短链接复制到浏览器地址栏中，浏览器会自动将其解析为对应的长链接，并将您重新导向到长链接所指向的页面。这个过程称为重定向（redirect），即浏览器自动将某个链接重定向到另一个链接。具体页面的内容会取决于长链接指向的实际网页
// 这是因为短链接服务采用了重定向技术。当您在浏览器中访问短链接时，服务器会根据短链接中的信息，找到与之对应的长链接，并在服务器端向浏览器发送一个重定向指令（状态码为302），告诉浏览器应该前往哪个网页。浏览器收到重定向指令后，会主动向服务器请求对应的长链接，并通过长链接来呈现网页内容。这样，您就能够方便地通过简短的短链接，访问到长链接指向的网页