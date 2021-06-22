import { Joi, errors, Segments, celebrate } from "celebrate";

class AuthValidator {
  public register() {
    return Joi.object().keys({
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
  }
}

export default AuthValidator;
