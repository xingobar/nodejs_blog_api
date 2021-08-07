export default class AuthorizationException extends Error {
  private code: number;

  constructor(message: string = "尚未登入", code: number = 401) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
