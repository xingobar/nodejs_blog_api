// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { getConnection } from "typeorm";

// repository
import CommentRepository from "repository/comment.repository";

// entity
import { Comment, CommentSortKey, CommentSortKeyType } from "entity/comment.entity";

@Service()
export default class CommentService {
  constructor(
    @InjectRepository()
    private readonly commentRepository: CommentRepository
  ) {}

  /**
   * 新增留言
   * @param param0
   */
  public async commentStore({ postId, userId, body }: { postId: number; userId: number; body: string }) {
    await this.commentRepository
      .createQueryBuilder("comments")
      .insert()
      .into(Comment)
      .values({
        postId,
        userId,
        body,
      })
      .execute();

    return await this.commentRepository
      .createQueryBuilder("comments")
      .where("userId = :userId", { userId })
      .andWhere("postId = :postId", { postId })
      .getOne();
  }

  /**
   * 取得留言資料
   *
   * @param param0
   */
  public async findCommentByPostId({
    postId,
    first,
    after,
    last,
    before,
    sortKey = CommentSortKey.CREATED_AT,
    reverse = true,
  }: {
    postId: number;
    first: number;
    after: Date;
    last: number;
    before: Date;
    sortKey?: CommentSortKey;
    reverse?: boolean;
  }) {
    let builder = await getConnection().createQueryBuilder();

    if (first) {
      if (after) {
        builder = builder
          .select(["comments.*", "COUNT(comments.id) OVER() AS total"])
          .from(Comment, "comments")
          .where("created_at < :createdAt", { createdAt: after })
          .orderBy("created_at", "DESC");
      } else {
        builder = builder
          .select(["comments.*", "COUNT(comments.id) OVER() AS total"])
          .from(Comment, "comments")
          .orderBy("created_at", "DESC");
      }
    }

    if (last) {
      if (before) {
        builder = builder.select(["comments.*", "total"]).from((qb) => {
          return qb
            .select(["comments.*", "COUNT(comments.id) OVER() AS total"])
            .from(Comment, "comments")
            .where("postId = :postId", { postId })
            .andWhere("created_at > :createdAt", { createdAt: before })
            .orderBy("created_at", "ASC")
            .take(last);
        }, "comments");
      } else {
        builder = builder.select(["comments.*", "total"]).from((qb) => {
          return qb
            .select(["comments.*", "COUNT(comments.id) OVER() AS total"])
            .from(Comment, "comments")
            .where("postId = :postId", { postId })
            .orderBy("created_at", "ASC")
            .take(last);
        }, "comments");
      }
    }

    builder = builder.where("postId = :postId", { postId }).orderBy(CommentSortKeyType[sortKey], reverse ? "DESC" : "ASC");

    return await builder.take(first || last).getRawMany();
  }

  /**
   * 取得文章總共留言數
   * @param {number} postId 文章編號
   */
  public async findTotalCommentByPostId(postId: number) {
    return await this.commentRepository
      .createQueryBuilder("comments")
      .where("postId = :postId", { postId })
      .andWhere("parentId IS NULL")
      .getCount();
  }

  /**
   * 取得文章的某一個留言
   * @param {object} param
   * @param {number} param.postId 文章編號
   * @param {number} param.commentId 留言編號
   */
  public async findByCommentAndPostId({ postId, commentId }: { postId: number; commentId: number }) {
    return await this.commentRepository
      .createQueryBuilder("comments")
      .where("postId = :postId", { postId })
      .andWhere("id = :id", { id: commentId })
      .getOne();
  }

  /**
   * 根據編號刪除留言
   * @param {number} commentId 留言編號
   */
  public async deleteById(commentId: number) {
    return await this.commentRepository
      .createQueryBuilder("comments")
      .softDelete()
      .from(Comment)
      .where("id = :id", { id: commentId })
      .execute();
  }
}
