import ValidatorAbstract from "validator/validator.abstract";
import Joi from "joi";

export default class PostValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super(payload);
  }

  public storeRule() {
    this.rules = Joi.object().keys({
      title: Joi.string().required().messages({
        "any.required": "請輸入標題",
      }),
      body: Joi.string().required().min(50).messages({
        "any.required": "請輸入文章內容",
        "string.min": "內容至少要 {#limit} 個字",
      }),
    });

    return this;
  }
}
