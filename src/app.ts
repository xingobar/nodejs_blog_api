import router from "./routes/router";
import express from "express";
import bodyParser from "body-parser";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setRoutes();
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
    for (let route of router) {
      this.app.use(route.getPrefix(), route.getRouter());
    }
  }
}

export default new App().app;
