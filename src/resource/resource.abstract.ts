export default abstract class ResourceAbstract {
  protected resource: any;

  constructor(resource: any) {
    this.resource = resource;
  }

  // 回傳 json
  public toJson(): any {
    return this.resource;
  }

  // 回傳 array
  public toArray(): any[] {
    return [this.resource];
  }

  /**
   * 是否為 promise
   * @param {any} data
   * @param {string} key
   */
  public isPromise(key: string): boolean {
    return this.resource[key] && this.resource[key].then && typeof this.resource[key] === "function";
  }

  public when(key: string): boolean {
    // 是 promise ||  已經加載
    return this.isPromise(key) || (this.resource[key] && !this.isPromise(key));
  }

  public getResource(): any {
    return this.resource;
  }

  // 回傳已格式化過的結構
  public abstract getFormat(): any;
}
