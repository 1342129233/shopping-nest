import { Controller, Get, ParseIntPipe, Query, Response, HttpStatus, HttpException } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
    constructor(private readonly appService: HomeService) {}

    @Get('/home/content')
    getHomeContent(@Response() res) {
        const response = {
            code:200,
            data: this.appService.getHomeContent(),
            message: "操作成功"
        };
        res.send(response);
    }

    @Get('/home/recommendProductList')
    getHomeRecommendProductList(
        @Query('page', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) page: string,
        @Query('pageSize', ParseIntPipe) pageSize: string,
        @Response() res
    ) {
        const response = {
            code:200,
            data: this.appService.getHomeRecommendProductList(),
            message: "操作成功"
        };
        res.send(response);
    }
}



