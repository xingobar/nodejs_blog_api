import { Container } from "typedi";
import PostService from "graphql/service/post.service";

export default {
  posts: async (_: any, args: any, context: any) => {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll();

    return posts;
  },
};
