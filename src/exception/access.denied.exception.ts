export default class AccessDeniedException extends Error {
  private code: number;

  constructor(message: string = "沒有權限", code: number = 403) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
