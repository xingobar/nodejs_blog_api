import { ConnectionOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const config: ConnectionOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: ["dist/database/entity/**/*{.js,.ts}"],
  migrations: ["dist/database/migration/**/*{.js,.ts}"],
  subscribers: ["dist/database/subscriber/**/*{.js,.ts}"],
  synchronize: true, // 之後改 modal 的話會同步資料庫
  logging: false,
  // migrations: ["src/migration/**/*.ts"],
};

export default config;
