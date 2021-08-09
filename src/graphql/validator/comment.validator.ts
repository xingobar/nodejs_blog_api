// validator
import ValidatorAbstract from "validator/validator.abstract";

// node_modules
import Joi from "joi";

export default class CommentValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super(payload);
  }

  /**
   * 新增留言規則
   */
  public commentStoreRule() {
    this.rules = Joi.object().keys({
      body: Joi.string().required().min(10).messages({
        "any.required": "請輸入留言內容",
        "string.min": "留言內容至少 {#limit} 個字",
      }),
      postId: Joi.number().required().messages({
        "any.required": "請輸入文章編號",
        "number.base": "文章編號格式不符",
      }),
    });

    return this;
  }

  /**
  * 留言更新規則
   */  
  public commentUpdateRule() {
    this.rules = Joi.object().keys({
      body: Joi.string().required().min(10).messages({
        "any.required": "請輸入留言內容",
        "string.min": "留言內容至少 {#limit} 個字",
      }),
    })

    return this
  }
}