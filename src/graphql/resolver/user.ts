export default {
  User: {
    /**
     * 取得會員個人資料
     */
    profile: (parent: any, args: any, context: any) => {
      return parent.profileId ? context.dataloader.profiles.load(parent.profileId) : null;
    },
  },
};
