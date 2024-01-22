import { Controller, Get, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiCreatedResponse, ApiExtraModels, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { LoginDto } from './swagger.dto';

@ApiTags('用户登录')
@Controller('swagger')
export class SwaggerController {
    @ApiOperation({
        summary: '用户登录',
        description: '用户名和密码登录',
    })
    @ApiCreatedResponse({
        type: LoginDto,
        description: '用户登录DTO'
    })
    @ApiExtraModels(LoginDto) // 指定需要额外导入的模型类，这些模型类可以不直接出现在当前操作中，但是由于需要在文档中显示，因此需要引入
    @ApiQuery({ name: 'password', type: String, example: '123456', required: true })
    @ApiQuery({ name: 'username', type: String, example: 'wagxin', required: true }) // 指定查询参数
    @ApiBody({ // 指定请求体信息
        type: LoginDto, 
        description: '指定请求体信息',
    })
    @Get()
    // @ApiParam({ // 指定路径参数 这个时候 @Get(":id") 应该是这个
    //     name: 'id', 
    //     example: 1, 
    //     description: 'User ID',
    //     type: Number 
    // })
    @ApiResponse({ status: 200, description: '用户登录'})
    findAll(@Body() loginData: LoginDto,): string[] {
        console.log(loginData)
        return ['swagger'];
    }
}
