import { gql } from "apollo-server";

const token = gql`
  """
  token 回傳值
  """
  type TokenPayload {
    """
    jwt token
    """
    token: String
  }
`;

export default token;
