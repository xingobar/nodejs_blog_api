import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent, getRepository } from "typeorm";
import { Likeable, LikeableEntityType } from "entity/likeable.entity";
import { Post } from "entity/post.entity";

@EventSubscriber()
export class LikeableSubscriber implements EntitySubscriberInterface<Likeable> {
  listenTo() {
    return Likeable;
  }

  async beforeInsert(event: InsertEvent<Likeable>) {
    const { entity } = event;

    if (entity.entityType === LikeableEntityType.Post) {
      await getRepository(Post)
        .createQueryBuilder()
        .update(Post)
        .where("id = :entityId", { entityId: entity.entityId })
        .set({
          likeCount: () => "like_count + 1",
        })
        .execute();
    }
  }

  async beforeRemove(event: RemoveEvent<Likeable>) {
    const { entity } = event;

    if (entity?.entityType === LikeableEntityType.Post) {
      await getRepository(Post)
        .createQueryBuilder()
        .update(Post)
        .where("id = :entityId", { entityId: entity.entityId })
        .set({
          likeCount: () => "like_count - 1",
        })
        .execute();
    }
  }
}
