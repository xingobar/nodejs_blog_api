export default abstract class ResourceAbstract {
  protected resource: any;
  protected index: number = 0;

  constructor(resource: any) {
    this.resource = resource;
  }

  public when(key: string): boolean {
    // 是 promise ||  已經加載
    return Object.keys(this.getCurrentResource()).includes(key) || Object.keys(this.getCurrentResource()).includes(`__${key}__`);
  }

  /**
   * 回傳陣列資料
   */
  public async toArray() {
    const array = [];
    for (const key in this.resource) {
      if (this.resource.hasOwnProperty(key)) {
        this.setIndex(parseInt(key, 10));
        // 轉成 json 格式
        array.push(await this.toJson(this.resource[key]));
      }
    }

    return array;
  }

  public getCurrentResource() {
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

  // 整理結構
  public abstract format(item: any): any;

  public abstract toJson(item: any): any;
}
