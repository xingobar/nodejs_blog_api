import ResourceAbstract from "resource/resource.abstract";
import { Post } from "entity/post.entity";
import UserResource, { IUserResource } from "resource/user.resource";

interface IPostResource {
  id: number;
  title: string;
  body: string;
  likeCount: number;
  bookmarkCount: number;
  viewCount: number;
  feedbackScore: number;
  createdAt: Date;
  updatedAt: Date;
  owner?: IUserResource;
}

export default class PostResource extends ResourceAbstract {
  constructor(data: any) {
    super(data);
  }

  public async toJson(post: any = this.resource): Promise<IPostResource> {
    const data = this.format(post) as IPostResource;

    // 是否加載 profile
    if (this.when("user")) {
      data.owner = await new UserResource(await this.getCurrentResource().user).toJson();
    }
    return data;
  }

  public async toArray(): Promise<any> {
    return await super.toArray();
  }

  public format(item: Post): Post {
    return {
      id: item.id,
      title: item.title,
      body: item.body,
      likeCount: item.likeCount,
      bookmarkCount: item.bookmarkCount,
      viewCount: item.viewCount,
      feedbackScore: item.feedbackScore,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    } as Post;
  }
}
