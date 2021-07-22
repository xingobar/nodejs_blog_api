import { Controller, Post, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import PermissionService from "admin/service/permission.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import AccessDeniedException from "exception/access.denied.exception";
import TagService from "admin/service/tag.service";

@Controller("/tags")
export default class TagController {
  @Post("/", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    const permissionService: PermissionService = Container.get(PermissionService);

    if (!(await permissionService.checkPermissionByUserId(req.session.user.id, "tag.created"))) {
      throw new AccessDeniedException();
    }

    const tagService: TagService = Container.get(TagService);

    const tag = await tagService.createTag(req.body.title);

    return res.json(tag);
  }
}
