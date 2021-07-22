import AdminAbstractRoute from "routes/admin/admin.abstract";
import { attachControllers } from "@decorators/express";
import TagController from "admin/controller/tag.controller";

export default class PermissionRoute extends AdminAbstractRoute {
  constructor() {
    super();
    this.setRoutes();
  }

  public setRoutes() {
    attachControllers(this.router, [TagController]);
  }
}
