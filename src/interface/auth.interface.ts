import { string } from "joi";

// 帳號註冊
export interface IAuthInput {
  account: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 新增會員
export interface ICreateUser {
  account: string;
  email: string;
  password: string;
}

/**
 * 登入
 */
export interface IAuthLogin {
  account: string;
  password: string;
}
