// validator
import ValidatorAbstract from "validator/validator.abstract";

// node_modules
import Joi from "joi";

// entity
import { PostStatus } from "entity/post.entity";

export default class PostValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super(payload);
  }

  /**
   * 喜歡文章規則
   */
  public likePostRule() {
    this.rules = Joi.object().keys({
      value: Joi.boolean().required().messages({
        "any.required": "請傳入參數",
      }),
    });
    return this;
  }

  /**
   * 新增文章規則
   */
  public postCreateRule() {
    this.rules = Joi.object().keys({
      title: Joi.string().required().messages({
        "any.required": "請輸入標題",
      }),
      body: Joi.string().required().min(50).messages({
        "any.required": "請輸入文章內容",
        "string.min": "內容至少要 {#limit} 個字",
      }),
      status: Joi.string()
        .required()
        .valid(...Object.values(PostStatus))
        .messages({
          "any.required": "請輸入狀態",
          "any.only": "文章狀態有誤",
        }),
      tags: Joi.array().items(Joi.number()).required().messages({
        "any.required": "請輸入標籤資料",
        "array.includesRequiredUnknowns": "需傳入標籤資料",
        "number.base": "請傳入正確的標籤資料",
      }),
    });

    return this;
  }
}
