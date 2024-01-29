export const redisConfig = {
    // url: 'redis://localhost:6379', // Redis的连接URL
    host: 'localhost',
    port: 6379,
    // password: 'admin123456', // 如果Redis设置了密码，需要在这里提供， 默认是不需要密码的
    // db: 0, // 使用的数据库，默认是0
    // 其他可选配置
    // keyPrefix: 'myapp:', // 所有存储在Redis中的键的前缀
    // name: 'myapp', // 连接的名称，如果你有多个Redis连接，可以使用这个名称来获取特定的连接
    lazyConnect: true, // 是否在启动时立即连接Redis，默认是false
    reconnectOnError: (err) => { // 当连接出错时，是否尝试重新连接
        console.error(err);
        return true;
    }
};