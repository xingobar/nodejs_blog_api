import { Joi, errors, Segments, celebrate } from "celebrate";
import ValidationAbstractor from "validator/validator.abstract";

class AuthValidator extends ValidationAbstractor {
  constructor(payload: any) {
    super();
    this.payload = payload;
  }

  public register(): ValidationAbstractor {
    this.rules = Joi.object().keys({
      account: Joi.string().required().min(6).max(20).messages({
        "any.required": "請輸入帳號",
        "string.min": "帳號至少要 {#limit} 位",
        "string.max": "帳號至多 {#limit} 位",
      }),
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
      confirmPassword: Joi.string().required().equal(Joi.ref("password")).messages({
        "any.only": "密碼不一致",
        "any.required": "請輸入確認密碼",
      }),
    });

    return this;
  }

  /**
   * 登入
   */
  public login(): ValidationAbstractor {
    this.rules = Joi.object().keys({
      account: Joi.string().required().messages({
        "any.required": "請輸入登入帳號",
      }),
      password: Joi.string().required().messages({
        "any.required": "請輸入密碼",
      }),
    });
    return this;
  }
}

export default AuthValidator;
