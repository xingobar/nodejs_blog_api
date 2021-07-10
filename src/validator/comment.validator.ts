import ValidatorAbstract from "validator/validator.abstract";
import Joi from "joi";

export default class CommentValidator extends ValidatorAbstract {
  constructor(payload: any) {
    super(payload);
  }

  /**
   * 父留言規則
   */
  public storeParentRule() {
    this.rules = Joi.object().keys({
      body: Joi.string().required().min(10).messages({
        "any.required": "請輸入留言內容",
        "string.min": "留言內容最少 {#limit} 個字",
      }),
    });

    return this;
  }

  /**
   * 更新父層留言
   */
  public updateParentRule() {
    return this.storeParentRule();
  }

  /**
   * 儲存子留言
   */
  public storeChildrenRule() {
    return this.storeParentRule();
  }
}
