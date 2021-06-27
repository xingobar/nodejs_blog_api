import Faker from "faker";
import { define } from "typeorm-seeding";
import { Profile, ProfileGender } from "../../entity/profile.entity";
import shuffle from "lodash/shuffle";

define(Profile, (faker: typeof Faker) => {
  const profile = new Profile();

  profile.phone = faker.phone.phoneNumber();
  profile.gender = shuffle(Object.values(ProfileGender))[0];

  return profile;
});
