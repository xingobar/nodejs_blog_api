import ResourceAbstract from "resource/resource.abstract";
import { Post } from "entity/post.entity";
import UserResource, { IUserResource } from "resource/user.resource";

interface IPostResource {
  id: number;
  title: string;
  body: string;
  owner?: IUserResource;
}

export default class PostResource extends ResourceAbstract {
  private post: IPostResource;

  constructor(data: any) {
    super(data);

    this.post = this.format(this.resource) as IPostResource;
  }

  public async toJson(post: IPostResource = this.post): Promise<IPostResource> {
    // 是否加載 profile
    if (this.when("user")) {
      post.owner = await new UserResource(await this.getResourceByIndex().user).toJson();
    }

    return post;
  }

  public format(item: Post): Post {
    return <Post>{
      id: item.id,
      title: item.title,
      body: item.body,
    };
  }
}
