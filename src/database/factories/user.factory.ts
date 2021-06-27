import Faker from "faker";
import { define, factory } from "typeorm-seeding";
import { User } from "../../entity/user.entity";
import { Profile } from "../../entity/profile.entity";
import { randomBytes } from "crypto";
import argon2 from "argon2";

define(User, (faker: typeof Faker) => {
  const user = new User();
  const salt = randomBytes(20);

  user.email = faker.internet.email();
  user.account = faker.lorem.word(10);
  user.password = argon2.hash("123456", { salt }) as any;

  user.profile = factory(Profile)() as any;

  return user;
});
