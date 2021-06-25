import { User } from "entity/user.entity";
import { getRepository } from "typeorm";

/**
 * 新建使用者
 * @param {User} data 要先增的會員資料
 * @return {User}
 */
export const createUser = async (data: User) => {
  const user = getRepository(User).create(data);
  return await getRepository(User).save(user);
};

/**
 * 根據電子信箱取得會員
 * @param {string} email 電子信箱
 */
export const getByEmail = async (email: string) => {
  return await getRepository(User).findOne({
    where: {
      email,
    },
  });
};
