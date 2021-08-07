export default {
  Post: {
    author(parent: any, args: any, context: any) {
      return context.dataloader.users.load(parent.userId);
    },
    dateTime(parent: any, args: any) {
      return {
        createdAt: parent.createdAt,
        updatedAt: parent.updatedAt,
      };
    },
    tags(parent: any, args: any, context: any) {
      return context.dataloader.tags.load(parent.id);
    },
  },
};
