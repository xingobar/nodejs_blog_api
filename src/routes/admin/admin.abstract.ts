import { Router } from "express";

export default abstract class AdminAbstractRoute {
  private path: string = "/admin/api";

  protected router = Router();

  protected abstract setRoutes(): void;

  public getPrefix(): string {
    return this.path;
  }

  public getRouter(): Router {
    return this.router;
  }
}
