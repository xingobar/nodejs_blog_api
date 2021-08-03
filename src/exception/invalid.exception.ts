class InvalidException extends Error {
  private code: number;
  private field: string;

  constructor(message: string = "", field: string = "", code: number = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.field = field;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default InvalidException;
