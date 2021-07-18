import * as swagger from "swagger-express-ts";
import logger from "lib/logger.lib";
import UserResponse from "swagger/response/user.response";
import InvalidException from "swagger/response/invalid.exception";
import AuthController from "controller/auth.controller";
import UserController from "controller/user.controller";

import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { Container } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";

export class SwaggerLib {
  private container: Container;
  public server: InversifyExpressServer;

  constructor() {
    this.container = new Container();
    this.server = new InversifyExpressServer(this.container);
    this.setSwaggerDefinition();
    this.setErrorConfig();
  }

  // 設定 error config
  public setErrorConfig() {
    this.server.setErrorConfig((app: any) => {
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.log(err);
        const { code, message } = err;
        logger.error(`url = ${req.path}, code => ${res.statusCode}, message => ${message}`);
        return res.status(code ?? 500).json({ message });
      });
    });
  }

  // 設定 swagger defintion
  private setSwaggerDefinition() {
    // note that you *must* bind your controllers to Controller
    this.setSwaggerBindController([AuthController]);
    this.setSwaggerBindResponse([UserResponse, InvalidException]);
  }

  // swagger bind controller
  private setSwaggerBindController(controllers: any[]) {
    controllers.forEach((controller) => {
      this.container.bind<interfaces.Controller>(TYPE.Controller).to(controller).inSingletonScope().whenTargetNamed(controller.TARGET_NAME);
    });
  }

  /**
   * swagger response
   * @param responses
   */
  private setSwaggerBindResponse(responses: any[]) {
    // this.swaggerContainer.bind(UserResponse.name).to(UserResponse);
    responses.forEach((item) => {
      this.container.bind(item.name).to(item);
    });
  }
}

export default new SwaggerLib();
