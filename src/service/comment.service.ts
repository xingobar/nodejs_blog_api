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
}
