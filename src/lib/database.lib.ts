import { Connection, createConnection, getConnectionManager, ConnectionManager, ConnectionOptions } from "typeorm";
import config from "config/index";

export default class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(): Promise<Connection> {
    let connection: Connection;

    const hasConnection = this.connectionManager.has("default");

    if (hasConnection) {
      connection = this.connectionManager.get("default");
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      const connectionOptions: ConnectionOptions = {
        name: "default",
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "blog_api",
        entities: ["dist/entity/**/*{.js,.ts}", __dirname + "/../entity/**/*{.js,.ts}"],
        migrations: ["dist/migration/**/*{.js,.ts}", __dirname + "/../migration/**/*{.js,.ts}"],
        subscribers: ["dist/subscriber/**/*{.js,.ts}", __dirname + "/../subscriber/**/*{.js,.ts}"],
        synchronize: false, // 之後改 modal 的話會同步資料庫
        logging: false,
        // migrations: ["src/migration/**/*.ts"],
      };
      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}
