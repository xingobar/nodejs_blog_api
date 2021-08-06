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
  post edge, 每筆資料內容
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
  post connection 分頁資料
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
  文章類型
  """
  enum PostType {
    """
    加入書籤的文章
    """
    BOOKMARKED

    """
    文章
    """
    POST

    """
    喜歡的文章
    """
    LIKES
  }
`;

export default post;
