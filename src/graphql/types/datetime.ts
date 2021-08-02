import { gql } from "apollo-server";

const dateTime = gql`
  """
  資料時間相關資料
  """
  type DataDateTime {
    """
    新增時間
    """
    createdAt: DateTime

    """
    更新時間
    """
    updatedAt: DateTime

    """
    刪除時間
    """
    deletedAt: DateTime
  }
`;

export default dateTime;
