import { gql } from "apollo-server";

const profile = gql`
  """
  個人資料
  """
  type Profile {
    """
    電話號碼
    """
    phone: String

    """
    性別
    """
    gender: ProfileGender
  }

  """
  個人資料性別
  """
  enum ProfileGender {
    """
    男性
    """
    MALE

    """
    女性
    """
    FEMALE
  }

  """
  個人資料儲存 payload
  """
  type ProfileStorePayload {
    """
    個人資料
    """
    profile: Profile

    """
    錯誤資訊
    """
    error: Error
  }
`;

export default profile;
