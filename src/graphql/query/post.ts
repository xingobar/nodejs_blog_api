import { Container } from "typedi";
import PostService from "graphql/service/post.service";

export default {
  posts: async (root: any, { cursor, limit }: any) => {
    const postService: PostService = Container.get(PostService);

    const posts = await postService.findAll({ cursor, limit });

    return posts;
  },
};
