import { celebrate } from "celebrate";
import { Request, Response } from "express";
import AuthValidator from "validator/authValidator";

class AuthController {
  /**
   * 註冊
   * @param req
   * @param res
   */
  public register(req: Request, res: Response) {
    console.log(req.body);

    const { error, value } = new AuthValidator().register().validate(req.body);

    console.log(error, value);

    res.json({ test: error });
  }
}

export default AuthController;
