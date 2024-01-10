export const mySql = {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "123456",
    database: "my_user",
    synchronize: true,
    logging: true,
    dropSchema: true,
    charset: "utf8mb4",
    timezone: "local",
    entities: [
        "src/typeorm/entity/**/*.ts" 
    ]
}

