// node_modules
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

// repository
import CommentRepository from "repository/comment.repository";

// entity
import { Comment } from "entity/comment.entity";

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
}
