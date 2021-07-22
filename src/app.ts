import router from "./routes/router";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import envConfig from "config/index";
import swaggerLib from "./swagger.lib"; // swagger init
import * as swagger from "swagger-express-ts";
import adminRouter from "./routes/admin/admin.router";

import { config } from "config/ormconfig";
import { createConnection, useContainer, ConnectionOptions } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import { pagination } from "typeorm-pagination";

class App {
  public app: express.Application;

  constructor() {
    this.setSwaggerConfigAndRoutes();
    this.buildServer();
    this.setDbConnection();
  }

  // 建置 swagger & route
  private setSwaggerConfigAndRoutes() {
    swaggerLib.server.setConfig((app: any) => {
      this.setConfig(app);

      app.use(
        swagger.express({
          definition: {
            info: {
              title: "nodejs blog api",
              version: "1.0",
            },
            externalDocs: {
              url: "/api-docs/swagger",
            },
            // Models can be defined here
          },
        })
      );

      // 建置 swagger route
      for (const route of router) {
        app.use(route.getPrefix(), route.getRouter());
      }

      // admin router
      for (const route of adminRouter) {
        app.use(route.getPrefix(), route.getRouter());
      }
    });
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

  /**
   * 設定 config
   */
  private setConfig(app: any) {
    app.use("/api-docs/swagger", express.static("swagger"));
    app.use("/api-docs/swagger/assets", express.static("node_modules/swagger-ui-dist"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(pagination);
    app.use(cookieParser());
    app.use(
      session({
        secret: envConfig.session.secret,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
      })
    );
  }

  // build server
  private buildServer() {
    this.app = swaggerLib.server.build();
  }
}

export default new App().app;
