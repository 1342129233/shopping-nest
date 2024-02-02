import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class SseController {
    constructor() {
        //
    }

    @Get('sse')
    sse(@Res() res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        
        setInterval(() => {
            res.write(`data: ${new Date().toISOString()}\n\n`);
        }, 1000);
    }
}

// 客户端可以使用 EventSource 来接收服务端发送的消息
// const eventSource = new EventSource('/sse');
// sse.addEventListener('message', event => {
//   console.log(event.data);
// }, false);

