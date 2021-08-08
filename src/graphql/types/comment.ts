import { gql } from "apollo-server";

const comment = gql`
  """
  留言資料
  """
  type Comment {
    """
    留言編號
    """
    id: ID!

    """
    留言內容
    """
    body: String

    """
    新增時間
    """
    createdAt: String

    """
    更新時間
    """
    updatedAt: String
  }

  """
  留言輸入的內容
  """
  input CommentStoreInput {
    """
    留言內容
    """
    body: String

    """
    文章編號
    """
    postId: ID!
  }

  """
  新增留言的回傳值
  """
  type CommentStorePayload {
    """
    新增留言的資料
    """
    comment: Comment

    """
    錯誤訊息
    """
    error: Error
  }
`;

export default comment;
