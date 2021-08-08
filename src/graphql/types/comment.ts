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
    會員編號
    """
    userId: ID!

    """
    留言內容
    """
    body: String

    """
    留言者
    """
    owner: User!

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

  """
  留言資料結構
  """
  type CommentEdge {
    """
    留言資料
    """
    node: Comment!

    """
    cursor
    """
    cursor: String!
  }

  """
  留言資料
  """
  type CommentConnection {
    """
    留言
    """
    edges: [CommentEdge]

    """
    分頁資料
    """
    pageInfo: PageInfo!
  }

  """
  留言排序欄位
  """
  enum CommentSortKey {
    """
    新增時間
    """
    CREATED_AT
  }

  """
  取得留言 input
  """
  input CommentGetInput {
    """
    取得前面幾筆資料
    """
    first: Int

    """
    after cursor
    """
    after: String

    """
    before cursor
    """
    before: String

    """
    取得幾筆資料
    """
    last: Int

    """
    排序欄位
    """
    sortKey: CommentSortKey

    """
    排序方式
    """
    reverse: Boolean
  }
`;

export default comment;
