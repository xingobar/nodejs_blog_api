import dotenv from "dotenv";
import router from "./routes/router";
import express from "express";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import config from "config/ormconfig";
import { Request, Response, NextFunction } from "express";

class App {
  public app: express.Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.setConfig();
    this.setRoutes();
    this.setDbConnection();
  }

  private setDbConnection() {
    console.log("set => ", config);
    createConnection(config)
      .then((connection) => {
        console.log("has connection to db => ", connection.isConnected);

        // connection.synchronize(true);
        // connection.runMigrations({
        //   transaction: "all",
        // });
      })
      .catch((error) => console.log("connection error: ", error));
  }

  /**
   * 設定 config
   */
  private setConfig() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  /**
   * 設定 router
   */
  private setRoutes() {
    for (const route of router) {
      this.app.use(route.getPrefix(), route.getRouter());
    }

    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const { code, message } = err;
      return res.status(code ?? 500).json({ message });
    });
  }
}

export default new App().app;
