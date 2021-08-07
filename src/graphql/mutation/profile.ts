// exception
import AuthorizationException from "exception/authorization.exception";

// node_modules
import { Container } from "typedi";

// service
import ProfileService from "graphql/service/profile.service";

export default {
  profileStore: async (_: any, { phone, gender }: any, context: any) => {
    if (!context.user) {
      throw new AuthorizationException();
    }

    const profileService: ProfileService = Container.get(ProfileService);

    const profile = await profileService.store({
      phone,
      gender,
      userId: context.user.id,
      profileId: context.user.profileId,
    });

    context.user.profileId = profile?.id ?? null;

    return {
      profile,
    };
  },
};
