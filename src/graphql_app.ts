import { config } from "config/ormconfig";
import { createConnection, useContainer, ConnectionOptions } from "typeorm";
import { Container } from "typeorm-typedi-extensions";

class App {
  constructor() {
    this.setDbConnection();
  }

  /**
   * 設定資料庫連線
   */
  private async setDbConnection() {
    // typeorm use typedi
    useContainer(Container);

    console.log("db connection => ", process.env.CONNECTION_NAME);

    try {
      const connection = await createConnection(config as ConnectionOptions);
      console.log("has connection to db => ", connection.isConnected);
    } catch (error) {
      console.log("connection error: ", error);
    }
  }
}

export default new App();
