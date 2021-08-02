import { gql } from "apollo-server";

const post = gql`
  """
  文章資料
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
    資料相關時間資料
    """
    dateTime: DataDateTime
  }
`;

export default post;
