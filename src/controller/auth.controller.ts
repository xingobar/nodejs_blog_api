import { Request, Response } from "express";
import AuthValidator from "validator/auth.validator";

class AuthController {
  /**
   * 註冊
   * @param req
   * @param res
   */
  public register(req: Request, res: Response) {
    console.log(req.body);

    const v = new AuthValidator(req.body);
    v.register().validate();

    if (v.isError()) {
      return res.json({ test: v.error });
    }

    res.json({ test: "test" });
  }
}

export default AuthController;
