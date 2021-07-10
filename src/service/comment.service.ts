import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import CommentRepository from "repository/comment.repository";
import { Comment } from "entity/comment.entity";

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
      .include((c) => c.parent);
  }

  /**
   * 刪除父的留言
   * @param comment
   */
  public deleteParentByCommentId(comment: Comment) {
    return this.commentRepository.delete(comment);
  }
}
