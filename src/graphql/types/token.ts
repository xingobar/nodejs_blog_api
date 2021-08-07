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

    """
    refresh token
    """
    refreshToken: String
  }
`;

export default token;
