// 这行代码是在 JavaScript 或者 TypeScript 文件中引入了 qiniu 这个 Node.js 模块。qiniu 是七牛云提供的一个 Node.js SDK，用于操作七牛云的对象存储服务
// 七牛云是一家提供云存储、CDN 等服务的公司，其对象存储服务可以用于存储和获取各种类型的数据和文件
// 1. 上传文件到七牛云
// 2. 下载七牛云上的文件
// 3. 上传文件到七牛云
// 4. 删除七牛云上的文件
// 5. 获取文件的元信息
// 配置你的七牛云 Access Key 和 Secret Key
// qiniu.conf.ACCESS_KEY = '<Your Access Key>';
// qiniu.conf.SECRET_KEY = '<Your Secret Key>';

import qiniu from 'qiniu';
// 需要填写你的 Access Key 和 Secret Key
const accessKey = 'rfjeAXQU4KHKdNvDDLeahkGItKrQmlL8GurvehYQ';
const secretKey = '';

// 使用 accessKey 和 secretKey 创建一个 Mac 对象,这个对象将用于后续的操作
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 指定要上传的存储空间(bucket)
const bucket = 'nest-file-demo';

// 指定要覆盖的文件名,如果不需要覆盖文件,可以忽略这个变量
const keyToOverwrite = 'nestjs.webp';

// 创建上传凭证的选项
const options = {
    // 如果需要覆盖文件
    // scope: bucket + ':' + keyToOverwrite,
    // 如果不需要覆盖文件, scope 就是 bucket
    scope: bucket,
    // 上传凭证的过期时间,单位是秒
    expires: 7200
};
// 使用选项创建一个 PutPolicy 对象
const putPolicy = new qiniu.rs.PutPolicy(options);
// 使用 mac 对象和 putPolicy 对象生成上传凭证
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;

// 指定要上传的文件名，这个文件名将用于在七牛云存储中标识这个文件
// const key = 'nestjs.webp';
const key = 'xxx';
// 指定本地文件的路径，这个文件将被上传到七牛云存储
const localFile = '～/nest_study/23.nest-multer-upload/my-uploads/gallery-1686975430032-489617690-3.webp';
// 创建一个 FormUploader 对象，这个对象将用于上传文件
const formUploader = new qiniu.form_up.FormUploader(config);
// 创建一个 PutExtra 对象，这个对象包含了一些额外的上传选项
const putExtra = new qiniu.form_up.PutExtra();

// 使用 FormUploader 对象上传文件
formUploader.putFile(
    // 上传凭证，这个值在前面的代码中已经生成
    uploadToken,
    // 文件名
    key,
    // 本地文件路径
    localFile,
    // 额外的上传选项
    putExtra,
    // 上传完成后的回调函数
    function(respErr, respBody, respInfo) {
        // 如果有错误,抛出错误
        if(respErr) {
            throw respErr;
        }
        // 如果上传成功,打印上传结果
        if(respInfo.statusCode === 200) {
            console.log(respBody);
        } else {
            // 如果上传失败,打印错误信息
            console.log(respInfo.statusCode);
            console.log(respbody);
        }
    }
)











