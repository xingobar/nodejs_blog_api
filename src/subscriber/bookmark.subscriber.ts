import { EventSubscriber, EntitySubscriberInterface, InsertEvent, getRepository, RemoveEvent } from "typeorm";
import { Bookmark, BookmarkEntityType } from "entity/bookmark.entity";
import { Post } from "entity/post.entity";

@EventSubscriber()
export class BookmarkSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Bookmark;
  }

  async beforeInsert(event: InsertEvent<Bookmark>) {
    console.log("before insert");
    const { entity } = event;

    if (entity.entityType === BookmarkEntityType.Post) {
      await getRepository(Post)
        .createQueryBuilder()
        .update(Post)
        .where("id = :id", { id: entity.entityId })
        .andWhere("bookmark_count >= 0")
        .set({
          bookmarkCount: () => "bookmark_count + 1",
        })
        .execute();
    }
  }

  async beforeRemove(event: RemoveEvent<Bookmark>) {
    const { entity } = event;

    if (entity?.entityType === BookmarkEntityType.Post) {
      await getRepository(Post)
        .createQueryBuilder()
        .update(Post)
        .where("id = :id ", { id: entity.entityId })
        .andWhere("bookmark_count >= 1")
        .set({
          bookmarkCount: () => "bookmark_count - 1",
        })
        .execute();
    }
  }
}
