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
    觀看次數
    """
    viewCount: Int

    """
    按讚次數
    """
    likeCount: Int

    """
    文章收藏次數
    """
    bookmarkCount: Int

    """
    作者資料
    """
    author: User

    """
    標籤
    """
    tags: [Tag!]!

    """
    推薦文章
    """
    recommend: [Post]

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

  """
  文章狀態
  """
  enum PostStatus {
    """
    發布的文章
    """
    PUBLISH

    """
    草稿
    """
    DRAFT

    """
    下架
    """
    OFFLINE
  }

  """
  喜歡文章 payload
  """
  type LikePostPayload {
    """
    文章
    """
    post: Post

    """
    錯誤訊息
    """
    error: Error
  }

  """
  收藏文章 payload
  """
  type BookmarkPostPayload {
    """
    文章
    """
    post: Post

    """
    錯誤訊息
    """
    error: Error
  }

  """
  文章新增 payload
  """
  type PostCreatePayload {
    """
    文章
    """
    post: Post

    """
    錯誤訊息
    """
    error: Error
  }

  """
  新增文章
  """
  input PostCreateInput {
    """
    文章標題
    """
    title: String

    """
    文章內容
    """
    body: String

    """
    文章狀態
    """
    status: PostStatus

    """
    標籤資料
    """
    tags: [Int]
  }
`;

export default post;
