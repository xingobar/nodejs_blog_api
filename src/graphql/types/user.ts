import { gql } from "apollo-server";

const user = gql`
  """
  使用者
  """
  type User {
    """
    編號
    """
    id: ID

    """
    使用者帳號
    """
    account: String
    """
    使用者信箱
    """
    email: String
    """
    使用者頭像
    """
    avatar: String

    """
    個人資料
    """
    profile: Profile

    """
    使用者文章資料
    """
    posts(
      """
      文章狀態
      """
      status: PostStatus
    ): [Post]
  }

  """
  新增使用者的 input
  """
  input SignUpInput {
    """
    電子郵件
    """
    email: String
    """
    要註冊的密碼
    """
    password: String
    """
    確認密碼
    """
    confirmPassword: String
    """
    使用者帳號
    """
    account: String
  }

  """
  登入的 input
  """
  input SignInInput {
    """
    會員帳號
    """
    account: String
    """
    會員密碼
    """
    password: String
  }

  """
  註冊的回傳值
  """
  type SignUpPayload {
    """
    新增的會員資料
    """
    user: User
    """
    錯誤訊息
    """
    error: Error
  }

  """
  登入的回傳值
  """
  type SignInPayload {
    """
    jwt token
    """
    jwt: TokenPayload

    """
    登入的使用者資料
    """
    user: User

    """
    error 資料
    """
    error: Error
  }

  """
  取得使用者 payload
  """
  type UserPayload {
    me: User
    error: Error
  }
`;

export default user;
