import ValidatorAbstract from "validator/validator.abstract";
import Joi from "joi";

export default class TagValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super(payload);
  }

  /**
   * 新增規則
   */
  public storeRule() {
    this.rules = Joi.object().keys({
      title: Joi.string().required().messages({
        "any.required": "請輸入標籤名稱",
      }),
      alias: Joi.string().required().messages({
        "any.required": "請輸入別名",
      }),
    });
    return this;
  }

  /**
   * 更新規則
   */
  public updateRule() {
    return this.storeRule();
  }
}
