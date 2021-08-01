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
  註冊的回傳值
  """
  type SignUpPayload {
    user: User
    error: Error
  }
`;

export default user;
