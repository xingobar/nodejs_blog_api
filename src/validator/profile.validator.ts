import { ProfileGender } from "entity/profile.entity";
import Joi from "joi";
import ValidatorAbstract from "validator/validator.abstract";

export default class ProfileValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super();
    this.payload = payload;
  }

  /**
   * 更新規則
   */
  public update(): ValidatorAbstract {
    this.rules = Joi.object().keys({
      gender: Joi.string()
        .required()
        .valid(...Object.values(ProfileGender))
        .messages({
          "any.required": "請輸入性別",
          "any.only": "性別有誤",
        }),
      phone: Joi.string().required().messages({
        "any.required": "請輸入電話號碼",
      }),
    });
    return this;
  }
}
