import { gql } from "apollo-server";

const tag = gql`
  """
  標籤
  """
  type Tag {
    """
    編號
    """
    id: ID!

    """
    標籤名稱
    """
    title: String

    """
    標籤別名
    """
    alias: String
  }
`;

export default tag;
