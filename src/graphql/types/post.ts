import { gql } from "apollo-server";

const post = gql`
  """
  文章
  """
  type Post {
    """
    文章 ID
    """
    id: ID!

    """
    文章標題
    """
    title: String

    """
    文章內容
    """
    body: String

    """
    作者資料
    """
    author: User

    """
    資料相關時間資料
    """
    dateTime: DataDateTime
  }

  """
  文章排序的欄位
  """
  enum PostSortKeys {
    """
    新增的日期
    """
    CREATED_AT

    """
    更新的時間
    """
    UPDATED_AT

    """
    編號
    """
    ID

    """
    文章名稱
    """
    TITLE
  }

  """
  post edge
  """
  type PostEdge {
    """
    cursor 資料
    """
    cursor: String!

    """
    實際的文章資料
    """
    node: Post!
  }

  """
  post connection
  """
  type PostConnection {
    """
    各個文章的資料
    """
    edges: [PostEdge!]!

    """
    分頁資料
    """
    pageInfo: PageInfo!
  }
`;

export default post;
