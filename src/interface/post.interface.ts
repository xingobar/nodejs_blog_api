import { User } from "entity/user.entity";
import { PostStatus } from "entity/post.entity";

// 新增文章
export interface ICreatePost {
  title: string;
  body: string;
  status: PostStatus;
}

// 更新文章
export interface IUpdatePost {
  title: string;
  body: string;
  user: User;
  status: PostStatus;
  tags: any[];
}

/**
 * 取得所有文章 payload
 * @param {object} orderBy
 * @param {string} orderBy.column 排序欄位
 * @param {string} orderBy.sort 排序方式
 * @param {string} keyword 關鍵字
 * @param {string} account 作者帳號
 * @param {number} limit 一頁幾筆資料
 * @param {number} page 目前頁碼
 */
export interface IGetAllPostParams {
  keyword?: string;
  account?: string;
  limit?: number;
  page?: number;
  column?: string;
  sort?: string;
}
