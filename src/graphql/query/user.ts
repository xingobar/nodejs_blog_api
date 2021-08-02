import AccessDeniedException from "exception/access.denied.exception";
export default {
  user: (_: any, args: any, context: any) => {
    if (!context.user) {
      return {
        me: null,
        error: {
          code: 401,
          message: "尚未登入",
          field: "",
        },
      };
    }

    return {
      me: context.user,
      error: null,
    };
  },
};
