import { ConnectionOptions } from "typeorm";
import envConfig from "config/index";

export const config: ConnectionOptions[] = [
  {
    name: "default",
    type: envConfig.database.driver as any,
    host: envConfig.database.mysql.host,
    port: envConfig.database.mysql.port,
    username: envConfig.database.mysql.username,
    password: envConfig.database.mysql.password,
    database: envConfig.database.mysql.database,
    entities: ["dist/entity/**/*{.js,.ts}", __dirname + "/../entity/**/*{.js,.ts}"],
    migrations: ["dist/migration/**/*{.js,.ts}", __dirname + "/../migration/**/*{.js,.ts}"],
    subscribers: ["dist/subscriber/**/*{.js,.ts}", __dirname + "/../subscriber/**/*{.js,.ts}"],
    synchronize: false, // 之後改 modal 的話會同步資料庫
    logging: false,
    // migrations: ["src/migration/**/*.ts"],
  },
  {
    name: "test",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "test_blog_api",
    entities: ["dist/entity/**/*{.js,.ts}", __dirname + "/../entity/**/*{.js,.ts}"],
    migrations: ["dist/migration/**/*{.js,.ts}", __dirname + "/../migration/**/*{.js,.ts}"],
    subscribers: ["dist/subscriber/**/*{.js,.ts}", __dirname + "/../subscriber/**/*{.js,.ts}"],
    synchronize: false, // 之後改 modal 的話會同步資料庫
    logging: false,
    // migrations: ["src/migration/**/*.ts"],
  },
];

// export const config: ConnectionOptions = {
//   name: "default",
//   type: envConfig.database.driver as any,
//   host: envConfig.database.mysql.host,
//   port: envConfig.database.mysql.port,
//   username: envConfig.database.mysql.username,
//   password: envConfig.database.mysql.password,
//   database: envConfig.database.mysql.database,
//   entities: ["dist/entity/**/*{.js,.ts}", __dirname + "/../entity/**/*{.js,.ts}"],
//   migrations: ["dist/migration/**/*{.js,.ts}", __dirname + "/../migration/**/*{.js,.ts}"],
//   subscribers: ["dist/subscriber/**/*{.js,.ts}", __dirname + "/../subscriber/**/*{.js,.ts}"],
//   synchronize: false, // 之後改 modal 的話會同步資料庫
//   logging: false,
//   // migrations: ["src/migration/**/*.ts"],
// };

export default config;
