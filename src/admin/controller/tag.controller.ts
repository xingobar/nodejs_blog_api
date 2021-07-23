import { Controller, Post, Request, Response, Delete, Put } from "@decorators/express";
import { Container } from "typedi";
import { TagPermissionAction } from "entity/permission.entity";

import PermissionService from "admin/service/permission.service";
import AuthenticateMiddleware from "middleware/authenticate.middleware";
import AccessDeniedException from "exception/access.denied.exception";
import TagService from "admin/service/tag.service";
import TagValidator from "admin/validator/tag.validator";
import NotFoundException from "exception/notfound.exception";

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

    if (!(await permissionService.checkPermissionByUserId(req.session.user.id, TagPermissionAction.TAG_CREATED))) {
      throw new AccessDeniedException();
    }

    const tagService: TagService = Container.get(TagService);

    const tag = await tagService.createTag(params.title, params.alias);

    return res.json(tag);
  }

  /**
   * 刪除標籤
   * @param req
   * @param res
   */
  @Delete("/:id", [AuthenticateMiddleware])
  public async destroy(@Request() req: any, @Response() res: any) {
    const permissionService: PermissionService = Container.get(PermissionService);

    if (!(await permissionService.checkPermissionByUserId(req.session.user.id, TagPermissionAction.TAG_DELETED))) {
      throw new AccessDeniedException();
    }

    const tagService: TagService = Container.get(TagService);

    const tag = await tagService.findById(req.params.id);

    if (!tag) {
      throw new NotFoundException();
    }

    await tagService.delete(tag);

    return res.json({ ok: "ok" });
  }

  /**
   * 更新標籤
   * @param req
   * @param res
   */
  @Put("/:id", [AuthenticateMiddleware])
  public async update(@Request() req: any, @Response() res: any) {
    interface IUpdateTag {
      title: string;
      alias: string;
    }

    const params: IUpdateTag = req.body;

    const v = new TagValidator(params);
    v.updateRule().validate();

    if (v.isError()) {
      return res.status(400).json({ errors: v.detail });
    }

    const permissionService: PermissionService = Container.get(PermissionService);

    if (!(await permissionService.checkPermissionByUserId(req.session.user.id, TagPermissionAction.TAG_UPDATED))) {
      throw new AccessDeniedException();
    }

    const tagService: TagService = Container.get(TagService);

    let tag = await tagService.findById(req.params.id);

    if (!tag) {
      throw new NotFoundException();
    }

    tag.title = params.title;

    tag = await tagService.update(tag);

    return res.json(tag);
  }
}
