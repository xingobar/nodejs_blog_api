// exception
import AccessDeniedException from "exception/access.denied.exception";
import NotFoundException from "exception/notfound.exception";

// node_modules
import { Container } from "typedi";
import { cloneDeep } from "lodash";

// service
import UserService from "graphql/service/user.service";
import PostService from "graphql/service/post.service";

export default {
  user: async (_: any, { id }: any, context: any) => {
    const userService = Container.get(UserService);

    const user = await userService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    const postService = Container.get(PostService);

    const posts = await postService.findByUsersId(user.id);

    return {
      me: {
        ...user,

        posts,
      },
    };
  },
};
