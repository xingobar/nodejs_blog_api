export default {
  Comment: {
    /**
     * 留言者
     * @param parent
     * @param args
     * @param context
     */
    owner(parent: any, args: any, context: any) {
      return context.dataloader.users.load([parent.userId]);
    },
  },
};
