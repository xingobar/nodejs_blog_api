// validator
import AuthValidator from "validator/auth.validator";

// service
import UserService from "graphql/service/user.service";

// node_modules
import { Container } from "typedi";
import jwt from "jsonwebtoken";

// config
import config from "config/index";

// entity
import { User } from "entity/user.entity";

// exeption
import AccessDeniedException from "exception/access.denied.exception";
import InvalidRequestException from "exception/invalid.exception";

export default {
  /**
   * 註冊帳號
   * @param {SignUpInput} 輸入的資料
   */
  signUp: async (_: any, { input }: any, context: any) => {
    const { email, account } = input;

    const v = new AuthValidator(input);
    v.register().validate();

    if (v.isError()) {
      return {
        user: null,
        error: {
          code: 400,
          message: v?.detail[0].message,
          field: v?.detail[0].field,
        },
      };
    }

    const userService: UserService = Container.get(UserService);

    // 檢查電子郵件
    if ((await userService.findByEmail(email)) !== undefined) {
      return {
        user: null,
        error: {
          code: 400,
          message: "電子信箱已存在",
          field: "email",
        },
      };
    }

    // 檢查帳號
    if ((await userService.findByAccount(account)) !== undefined) {
      return {
        user: null,
        error: {
          code: 400,
          message: "帳號已存在",
          field: "account",
        },
      };
    }

    // 新增帳號
    const user = await userService.createUser(input);

    return {
      user,
      error: null,
    };
  },
  /**
   * 登入
   * @param {SignInInput} 輸入的資料
   */
  signIn: async (_: any, { input }: any, context: any) => {
    const { account, password } = input;

    const v = new AuthValidator(input);
    v.login().validate();

    if (v.isError()) {
      return {
        jwt: null,
        user: null,
        error: {
          code: 400,
          message: v.detail[0].message,
          field: v.detail[0].field,
        },
      };
    }

    const userService: UserService = Container.get(UserService);

    const user = await userService.findByAccount(account);

    // 根據帳號尋找會員
    if (!user) {
      return {
        jwt: null,
        user: null,
        error: {
          code: 400,
          message: "帳號不存在",
          field: "account",
        },
      };
    }

    // 密碼一致
    if (await userService.checkPasswordMatch({ account, password })) {
      const token = userService.generateJwtToken(user);

      const refreshToken = userService.generateRefreshJwtToken(user);

      return {
        jwt: {
          token,
          refreshToken,
        },
        user,
        error: null,
      };
    }

    return {
      jwt: null,
      user: null,
      error: {
        code: 400,
        message: "帳號或密碼錯誤",
        field: "password",
      },
    };
  },

  /**
   * refresh token
   */
  refreshToken: async (_: any, { token }: any, context: any) => {
    try {
      await jwt.verify(token ?? "", config.jwt.secret);

      const userService = Container.get(UserService);

      const user = await userService.findByAccount(context.user.account);

      return {
        user,
        jwt: {
          token: await userService.generateJwtToken(user),
          refreshToken: await userService.generateRefreshJwtToken(user),
        },
      };
    } catch (e) {
      console.log("line 166 => ", e);
      throw new InvalidRequestException("token 有誤");
    }
  },
};
