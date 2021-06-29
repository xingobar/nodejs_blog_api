import dotenv from "dotenv";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("env not found");
}

export default {
  // 執行環境
  env: process.env.NODE_ENV ?? "development",

  connectionName: process.env.CONNECTION_NAME ?? "default",

  // app port
  port: process.env.APP_PORT ?? 3000,

  // node module path
  nodePath: process.env.NODE_PATH ?? "src",

  // 資料庫資訊
  database: {
    driver: process.env.DB_DRIVER?.toString() ?? "mysql",
    synchronize: process.env.DB_SYNC ?? false,
    mysql: {
      host: process.env.DB_HOST ?? "localhost",
      // 帳號
      username: process.env.MYSQL_USERNAME ?? "root",
      // 密碼
      password: process.env.MYSQL_PASSWORD ?? "",
      // 資料庫
      database: process.env.MYSQL_DB ?? "blog_api",
      // port
      port: parseInt(process.env.MYSQL_PORT ?? "3306", 10) ?? 3306,
    },
  },

  jwt: {
    secret: process.env.TOKEN_SECRET ?? "blog_api",
  },
};
