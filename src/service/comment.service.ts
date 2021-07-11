import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import CommentRepository from "repository/comment.repository";
import { Comment } from "entity/comment.entity";
import { getManager } from "typeorm";

@Service()
export default class CommentService {
  constructor(
    @InjectRepository()
    private readonly commentRepository: CommentRepository
  ) {}

  /**
   * 新增父留言
   * @param {object} comment
   * @param {string} comment.body
   * @param {number} comment.userId
   * @param {number} comment.postId
   */
  public async createParentComment(comment: { body: string; userId: number; postId: number }) {
    return await this.commentRepository.create({
      ...comment,
    } as Comment);
  }

  /**
   * 取得父留言
   * @param postId
   * @param commentId
   */
  public findParentCommentById(postId: number, commentId: number) {
    return this.commentRepository
      .getOne()
      .where((c) => c.id)
      .equal(commentId)
      .where((c) => c.postId)
      .equal(postId)
      .where((c) => c.parentId)
      .isNull();
  }

  /**
   * 刪除父的留言
   * @param comment
   */
  public deleteParentByCommentId(comment: Comment) {
    return this.commentRepository.delete(comment);
  }

  /**
   * 更新評論
   * @param comment
   */
  public updateComment(comment: Comment) {
    return this.commentRepository.update(comment);
  }

  /**
   * 新增子留言
   * @param {Comment} parent
   * @param {object} children
   * @param {number} children.userId
   * @param {string} children.body
   */
  public async createChildrenComment(parent: Comment, { userId, body }: { userId: number; body: string }) {
    const children: Comment = new Comment();
    children.body = body;
    children.userId = userId;
    children.parent = parent;
    children.postId = parent.postId;
    return await this.commentRepository.create(children);
  }

  /**
   * 取得子留言
   * @param {number} parentId 父曾留言
   * @param {number} childrenId 子留言編號
   */
  public findChildrenCommentById(parentId: number, childrenId: number) {
    return this.commentRepository
      .getOne()
      .where((c) => c.parentId)
      .equal(parentId)
      .and((c) => c.id)
      .equal(childrenId);
  }

  /**
   * 更新子留言
   * @param children
   */
  public async updateChildren(children: Comment) {
    return await this.commentRepository.update(children);
  }

  /**
   * 刪除子留言
   * @param children
   */
  public async deleteChildren(children: Comment) {
    return await this.commentRepository.delete(children);
  }

  /**
   * 取得文章的子留言
   * @param {number} postId - 文章編號
   */
  public findAllChildrenComment(postId: number) {
    return this.commentRepository
      .createQueryBuilder("comments")
      .where((qb) => {
        qb.where("comments.postId = :postId", { postId }).andWhere("comments.parentId IS NULL");
      })
      .leftJoinAndSelect("comments.children", "children")
      .select("children.body")
      .addSelect("children.id")
      .addSelect("children.createdAt")
      .addSelect("children.updatedAt")
      .addSelect("comments.body")
      .addSelect("comments.id")
      .addSelect("comments.createdAt")
      .addSelect("comments.updatedAt")
      .orderBy("comments.createdAt", "DESC")
      .getMany();
  }
}
