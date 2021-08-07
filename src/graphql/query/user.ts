// exception
import AccessDeniedException from "exception/access.denied.exception";
import NotFoundException from "exception/notfound.exception";

// node_modules
import { Container } from "typedi";

// service
import UserService from "graphql/service/user.service";
export default {
  user: async (_: any, { id }: any, context: any) => {
    const userService = Container.get(UserService);

    const user = await userService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      me: user,
    };
  },
};
