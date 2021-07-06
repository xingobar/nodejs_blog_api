import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { Container } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from "inversify-express-utils";

class Swagger {
  private container: Container;
  public server: InversifyExpressServer;

  constructor() {
    this.container = new Container();
  }

  public setSwaggerConfig() {
    this.server = new InversifyExpressServer(this.container);

    this.server.setConfig((app: any) => {
      // this.setConfig(app);

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

      // for (const route of router) {
      //   app.use(route.getPrefix(), route.getRouter());
      // }
    });
  }

  // 設定 error config
  public setErrorConfig() {
    // this.server.setErrorConfig((app: any) => {});
  }
}
