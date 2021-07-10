import dotenv from "dotenv";
import router from "./routes/router";
import express from "express";
import bodyParser from "body-parser";
import logger from "lib/logger.lib";

import { config } from "config/ormconfig";

import { createConnection, useContainer, ConnectionOptions } from "typeorm";
import { Request, Response, NextFunction } from "express";
import { Container } from "typeorm-typedi-extensions";

import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { Container as SwaggerContainer } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from "inversify-express-utils";
import { pagination } from "typeorm-pagination";

import UserResponse from "swagger/response/user.response";

import AuthController from "controller/auth.controller";
import UserController from "controller/user.controller";

class App {
  public app: express.Application;

  public swaggerContainer: SwaggerContainer;

  public server: InversifyExpressServer;

  constructor() {
    this.swaggerContainer = new SwaggerContainer();
    // this.app = express();
    this.setSwaggerDefinition();
    this.setSwaggerConfig();
    this.setErrorConfig();
    this.buildServer();
    // this.setConfig();
    // this.setRoutes();
    this.setDbConnection();
  }

  private setSwaggerDefinition() {
    // note that you *must* bind your controllers to Controller
    this.setSwaggerBindController([AuthController]);
    this.setSwaggerBindResponse([UserResponse]);
  }

  private setSwaggerConfig() {
    this.server = new InversifyExpressServer(this.swaggerContainer);

    this.server.setConfig((app: any) => {
      this.setConfig(app);

      app.use(
        swagger.express({
          definition: {
            info: {
              title: "My api",
              version: "1.0",
            },
            externalDocs: {
              url: "My url",
            },
            // Models can be defined here
          },
        })
      );

      for (const route of router) {
        app.use(route.getPrefix(), route.getRouter());
      }
    });
  }

  // 設定 error config
  private setErrorConfig() {
    this.server.setErrorConfig((app: any) => {
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err);
        const { code, message } = err;
        logger.error(`url = ${req.path}, code => ${res.statusCode}, message => ${message}`);
        return res.status(code ?? 500).json({ message });
      });
    });
  }

  // swagger bind controller
  private setSwaggerBindController(controllers: any[]) {
    controllers.forEach((controller) => {
      this.swaggerContainer
        .bind<interfaces.Controller>(TYPE.Controller)
        .to(controller)
        .inSingletonScope()
        .whenTargetNamed(controller.TARGET_NAME);
    });
  }

  private setSwaggerBindResponse(responses: any[]) {
    // this.swaggerContainer.bind(UserResponse.name).to(UserResponse);
    responses.forEach((item) => {
      this.swaggerContainer.bind(item.name).to(item);
    });
  }

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
  }

  /**
   * 設定 router
   */
  private setRoutes() {
    for (const route of router) {
      this.app.use(route.getPrefix(), route.getRouter());
    }

    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.log(err);
      const { code, message } = err;
      logger.error(`url = ${req.path}, code => ${res.statusCode}, message => ${message}`);
      return res.status(code ?? 500).json({ message });
    });
  }

  private buildServer() {
    this.app = this.server.build();
  }
}

export default new App().app;
