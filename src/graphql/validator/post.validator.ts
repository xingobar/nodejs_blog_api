// validator
import ValidatorAbstract from "validator/validator.abstract";

// node_modules
import Joi from "joi";

export default class PostValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super(payload);
  }

  public likePostRule() {
    this.rules = Joi.object().keys({
      value: Joi.boolean().required().messages({
        "any.required": "請傳入參數",
      }),
    });
    return this;
  }
}
