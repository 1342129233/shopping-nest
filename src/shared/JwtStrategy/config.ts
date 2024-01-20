// jwt秘钥，固定随机字符串
export const JWT_SECRET = "NODE_TEST_SECRET";

// jwt有效期 Eg: "60s", "3h", "2d"
export const JWT_EXPIRES = "2h"; // 2小时

export const options = {
    secret: JWT_SECRET, // jwt秘钥
    signOptions: {
        expiresIn: JWT_EXPIRES, // jwt有效期
    }
};
