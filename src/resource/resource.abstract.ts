export default abstract class ResourceAbstract {
  protected resource: any;
  protected index: number = 0;

  constructor(resource: any) {
    this.resource = resource;
  }

  /**
   * 是否為 promise
   * @param {any} data
   * @param {string} key
   */
  public isPromise(key: string): boolean {
    return this.getResourceByIndex()[key] && this.getResourceByIndex()[key].then && typeof this.getResourceByIndex()[key] === "function";
  }

  public when(key: string): boolean {
    // 是 promise ||  已經加載
    return this.isPromise(key) || (this.getResourceByIndex()[key] && !this.isPromise(key));
  }

  public getResourceByIndex() {
    if (Array.isArray(this.resource)) {
      return this.resource[this.index];
    }
    return this.resource;
  }

  /**
   * 回傳接受到的值
   */
  public getResource(): any {
    return this.resource;
  }

  /**
   * 設定索引
   * @param index
   */
  public setIndex(index: number) {
    this.index = index;
  }

  // 回傳已格式化過的結構
  public abstract getFormat(): any;

  // 整理結構
  public abstract format(item: any): any;
}
