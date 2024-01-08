import { Controller, Get, Response, Req } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('/home/productCateList')
export class CategoryController {
    constructor(private readonly appService: CategoryService) {}

    @Get(':id')
    productCateTabs(@Req() request: Request, @Response() res) {
        const parts = request.url.split('/');
        const id = +parts[parts.length - 1];
        
        const response = {
            code:200,
            data: this.appService.productCate(id),
            message: "操作成功"
        };
        res.send(response);
    }
}
