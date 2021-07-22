import { Controller, Post, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import PermissionService from "admin/service/permission.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import AccessDeniedException from "exception/access.denied.exception";
import TagService from "admin/service/tag.service";
import TagValidator from "admin/validator/tag.validator";
import InvalidException from "exception/invalid.exception";

@Controller("/tags")
export default class TagController {
  /**
   * 新增標籤
   * @param req
   * @param res
   */
  @Post("/", [AuthenticateMiddleware])
  public async store(@Request() req: any, @Response() res: any) {
    interface IStoreTag {
      title: string;
      alias: string;
    }

    const params: IStoreTag = req.body;

    const v: TagValidator = new TagValidator(params);
    v.storeRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const permissionService: PermissionService = Container.get(PermissionService);

    if (!(await permissionService.checkPermissionByUserId(req.session.user.id, "tag.created"))) {
      throw new AccessDeniedException();
    }

    const tagService: TagService = Container.get(TagService);

    const tag = await tagService.createTag(params.title, params.alias);

    return res.json(tag);
  }
}
