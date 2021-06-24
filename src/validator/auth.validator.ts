import { Joi, errors, Segments, celebrate } from "celebrate";
import ValidationAbstractor from "validator/validator.abstract";

class AuthValidator extends ValidationAbstractor {
  constructor(payload: any) {
    super();
    this.payload = payload;
  }

  public register(): ValidationAbstractor {
    this.rules = Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .messages({
          "any.required": "請輸入電子郵件",
          "string.email": "電子郵件格式不符",
        }),
      password: Joi.string().required().min(6).max(12).messages({
        "any.required": "請輸入密碼",
        "string.min": `密碼至少要 {#limit} 位 `,
        "string.max": `密碼至多 {#limit} 位`,
      }),
    });

    return this;
  }
}

export default AuthValidator;
