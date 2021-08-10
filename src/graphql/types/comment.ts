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

  """
  刪除留言 payload
  """
  type CommentDeletePayload {
    """
    刪除的留言
    """
    comment: Comment

    """
    錯誤訊息
    """
    error: Error
  }

  """
  留言更新 input
  """
  input CommentUpdateInput {
    """
    文章編號
    """
    postId: ID!

    """
    留言編號
    """
    commentId: ID!

    """
    留言內容
    """
    body: String
  }

  """
  留言更新 payload
  """
  type CommentUpdatePayload {
    """
    更新後的留言資料
    """
    comment: Comment

    """
    錯誤訊息
    """
    error: Error
  }

  """
  子留言 input
  """
  input CommentChildrenCreateInput {
    """
    父曾編號
    """
    parentId: ID!

    """
    文章編號
    """
    postId: ID!

    """
    留言內容
    """
    body: String
  }

  """
  子留言回傳值
  """
  type CommentChildrenCreatePayload {
    """
    子留言資料
    """
    comment: Comment

    """
    錯誤訊息
    """
    error: Error
  }

  """
  子層留言更新
  """
  input CommentChildrenUpdateInput {
    """
    父曾編號
    """
    parentId: ID!

    """
    文章編號
    """
    postId: ID!

    """
    留言編號
    """
    id: ID!

    """
    留言內容
    """
    body: String
  }

  """
  子留言更新 payload
  """
  type CommentChildrenUpdatePayload {
    """
    留言
    """
    comment: Comment

    """
    錯誤訊息
    """
    error: Error
  }

  """
  子留言刪除
  """
  input CommentChildrenRemove {
    """
    子留言編號
    """
    id: ID!

    """
    文章編號
    """
    postId: ID!

    """
    父曾編號
    """
    parentId: ID!
  }

  """
  子留言刪除
  """
  type CommentChildrenRemovePayload {
    """
    留言
    """
    comment: Comment

    """
    錯誤訊息
    """
    error: Error
  }
`;

export default comment;
