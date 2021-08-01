import { gql } from "apollo-server";

const error = gql`
  """
  錯誤資料
  """
  type Error {
    """
    錯誤代碼
    """
    code: String
    """
    錯誤訊息
    """
    message: String!
    """
    錯誤的欄位
    """
    field: String!
  }
`;

export default error;
