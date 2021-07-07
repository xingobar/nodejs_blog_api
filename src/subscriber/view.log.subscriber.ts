import { EntitySubscriberInterface, EventSubscriber, InsertEvent, getRepository } from "typeorm";
import { ViewLog, ViewLogEntityType } from "entity/view.log.entity";
import { Post } from "entity/post.entity";

@EventSubscriber()
export class ViewLogSubscriber implements EntitySubscriberInterface {
  async beforeInsert(event: InsertEvent<ViewLog>) {
    const { entity } = event;

    if (entity.entityType === ViewLogEntityType.Post) {
      await getRepository(Post)
        .createQueryBuilder()
        .update(Post)
        .set({
          viewCount: () => "view_count + 1",
        })
        .execute();
    }
  }
}
