class NotFoundException extends Error {
  private code: number;

  constructor(message: string = "找不到資料", code: number = 404) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default NotFoundException;
