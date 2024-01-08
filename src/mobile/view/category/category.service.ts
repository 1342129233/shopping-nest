import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CategoryService {
    productCate(id: number) {
        let list = [];
        switch (id) {
            case 0:
                list = [
                    {
                        "id": 1,
                        "keywords": "服装",
                        "level": 0,
                        "name": "服装",
                        "navStatus": 1,
                        "parentId": 0,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 1
                    },
                    {
                        "id": 2,
                        "keywords": "手机数码",
                        "level": 0,
                        "name": "手机数码",
                        "navStatus": 1,
                        "parentId": 0,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 1
                    },
                    {
                        "id": 3,
                        "keywords": "家用电器",
                        "level": 0,
                        "name": "家用电器",
                        "navStatus": 1,
                        "parentId": 0,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 1
                    },
                    {
                        "id": 4,
                        "keywords": "家具家装",
                        "level": 0,
                        "name": "家具家装",
                        "navStatus": 1,
                        "parentId": 0,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 1
                    },
                    {
                        "id": 5,
                        "keywords": "汽车用品",
                        "level": 0,
                        "name": "汽车用品",
                        "navStatus": 1,
                        "parentId": 0,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 1
                    },
                    {
                        "icon": "",
                        "id": 52,
                        "keywords": "电脑办公",
                        "level": 0,
                        "name": "电脑办公",
                        "navStatus": 1,
                        "parentId": 0,
                        "productCount": 0,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 1
                    }
                ];
                break;
            case 1:
                list = [
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac4780cN6087feb5.jpg",
                        "id": 7,
                        "keywords": "外套",
                        "level": 1,
                        "name": "外套",
                        "navStatus": 1,
                        "parentId": 1,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac47ffaN8a7b2e14.png",
                        "id": 8,
                        "keywords": "T恤",
                        "level": 1,
                        "name": "T恤",
                        "navStatus": 1,
                        "parentId": 1,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac47845N7374a31d.jpg",
                        "id": 9,
                        "keywords": "休闲裤",
                        "level": 1,
                        "name": "休闲裤",
                        "navStatus": 1,
                        "parentId": 1,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac47841Nff658599.jpg",
                        "id": 10,
                        "keywords": "牛仔裤",
                        "level": 1,
                        "name": "牛仔裤",
                        "navStatus": 1,
                        "parentId": 1,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac48007Nb30b2118.jpg",
                        "id": 11,
                        "keywords": "衬衫",
                        "level": 1,
                        "name": "衬衫",
                        "navStatus": 1,
                        "parentId": 1,
                        "productCount": 100,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    }
                ];
                break;
            case 2:
                list = [
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac48d27N3f5bb821.jpg",
                        "id": 19,
                        "keywords": "手机通讯",
                        "level": 1,
                        "name": "手机通讯",
                        "navStatus": 0,
                        "parentId": 2,
                        "productCount": 0,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5ac48672N11cf61fe.jpg",
                        "id": 30,
                        "keywords": "手机配件",
                        "level": 1,
                        "name": "手机配件",
                        "navStatus": 0,
                        "parentId": 2,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5a1679f2Nc2f659b6.jpg",
                        "id": 31,
                        "keywords": "",
                        "level": 1,
                        "name": "摄影摄像",
                        "navStatus": 0,
                        "parentId": 2,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5a167859N01d8198b.jpg",
                        "id": 32,
                        "keywords": "",
                        "level": 1,
                        "name": "影音娱乐",
                        "navStatus": 0,
                        "parentId": 2,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20190519/5a1676e9N1ba70a81.jpg",
                        "id": 33,
                        "keywords": "",
                        "level": 1,
                        "name": "数码配件",
                        "navStatus": 0,
                        "parentId": 2,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    }
                ];
                break;
            case 3:
                list = [
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a17f71eN25360979.jpg",
                        "id": 35,
                        "keywords": "",
                        "level": 1,
                        "name": "电视",
                        "navStatus": 0,
                        "parentId": 3,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a17f6f6Ndfe746aa.jpg",
                        "id": 36,
                        "keywords": "",
                        "level": 1,
                        "name": "空调",
                        "navStatus": 0,
                        "parentId": 3,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a17f6eaN9ec936de.jpg",
                        "id": 37,
                        "keywords": "",
                        "level": 1,
                        "name": "洗衣机",
                        "navStatus": 0,
                        "parentId": 3,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a17f6c5Ne56d7e26.jpg",
                        "id": 38,
                        "keywords": "",
                        "level": 1,
                        "name": "冰箱",
                        "navStatus": 0,
                        "parentId": 3,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a17f369N6a55ff3f.jpg",
                        "id": 39,
                        "keywords": "",
                        "level": 1,
                        "name": "厨卫大电",
                        "navStatus": 0,
                        "parentId": 3,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    }
                ];
                break;
            case 4:
                list = [
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a1eb12cN5ab932bb.jpg",
                        "id": 43,
                        "keywords": "",
                        "level": 1,
                        "name": "厨房卫浴",
                        "navStatus": 0,
                        "parentId": 4,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a1eb115Na5705672.jpg",
                        "id": 44,
                        "keywords": "",
                        "level": 1,
                        "name": "灯饰照明",
                        "navStatus": 0,
                        "parentId": 4,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a28e743Nf6d99998.jpg",
                        "id": 45,
                        "keywords": "",
                        "level": 1,
                        "name": "五金工具",
                        "navStatus": 0,
                        "parentId": 4,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a1eb096N6326e0bd.jpg",
                        "id": 46,
                        "keywords": "",
                        "level": 1,
                        "name": "卧室家具",
                        "navStatus": 0,
                        "parentId": 4,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a1eb080N38c2e7b7.jpg",
                        "id": 47,
                        "keywords": "",
                        "level": 1,
                        "name": "客厅家具",
                        "navStatus": 0,
                        "parentId": 4,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    }
                ];
                break;
            case 5:
                list = [
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/ebe31b9cc535e122.png",
                        "id": 48,
                        "keywords": "",
                        "level": 1,
                        "name": "全新整车",
                        "navStatus": 0,
                        "parentId": 5,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a1fb8d2N53bbd2ba.jpg",
                        "id": 49,
                        "keywords": "",
                        "level": 1,
                        "name": "车载电器",
                        "navStatus": 0,
                        "parentId": 5,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a1fb8baNbe801af8.jpg",
                        "id": 50,
                        "keywords": "",
                        "level": 1,
                        "name": "维修保养",
                        "navStatus": 0,
                        "parentId": 5,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20200607/5a28ae20N34461e66.jpg",
                        "id": 51,
                        "keywords": "",
                        "level": 1,
                        "name": "汽车装饰",
                        "navStatus": 0,
                        "parentId": 5,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    }
                ];
                break;
            case 52:
                list = [
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20221028/pad_category_01.jpg",
                        "id": 53,
                        "keywords": "平板电脑",
                        "level": 1,
                        "name": "平板电脑",
                        "navStatus": 0,
                        "parentId": 52,
                        "productCount": 0,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20221028/computer_category_01.jpg",
                        "id": 54,
                        "keywords": "笔记本",
                        "level": 1,
                        "name": "笔记本",
                        "navStatus": 0,
                        "parentId": 52,
                        "productCount": 0,
                        "productUnit": "件",
                        "showStatus": 1,
                        "sort": 0
                    },
                    {
                        "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20221108/ssd_category_01.jpg",
                        "id": 55,
                        "keywords": "硬盘",
                        "level": 1,
                        "name": "硬盘",
                        "navStatus": 0,
                        "parentId": 52,
                        "productCount": 0,
                        "productUnit": "",
                        "showStatus": 1,
                        "sort": 0
                    }
                ];
                break;
            default:
                list = [];
                break;
        }
        return list;
    }
}
