import IError from "@src/interface/error.interface";
import Joi, { ValidationError, ValidationResult } from "joi";

abstract class ValidatorAbstract {
  protected payload: any;

  private _rules: Joi.AnySchema = Joi.object().keys({});

  private _error?: ValidationError;

  private _value?: ValidationResult;

  constructor(payload: any) {
    this.payload = payload;
  }

  /**
   * 驗證
   */
  public validate() {
    const { error, value }: { error?: ValidationError; value: ValidationResult } = this._rules.validate(this.payload);

    this._error = error;
    this._value = value;

    return this._rules.validate(this.payload);
  }

  /**
   * 驗證
   */
  public async validateAsync() {
    const { error, value }: { error?: ValidationError; value: ValidationResult } = await this._rules.validateAsync(this.payload);

    this._error = error;
    this._value = value;

    return this._rules.validateAsync(this.payload);
  }

  /**
   * 取得錯誤訊息
   */
  public get error(): ValidationError | undefined {
    return this._error;
  }

  /**
   * 取得值
   */
  public get value(): ValidationResult | undefined {
    return this._value;
  }

  /**
   * 是否有錯
   */
  public isError(): boolean {
    return this._error !== undefined;
  }

  public set rules(data: Joi.AnySchema) {
    this._rules = data;
  }

  /**
   * 客製化回傳訊息
   */
  public get detail(): IError[] {
    return (
      this._error?.details.map<IError>((item) => {
        return { message: item.message };
      }) ?? [{ message: "" }]
    );
  }
}

export default ValidatorAbstract;
