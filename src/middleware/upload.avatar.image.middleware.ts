import { Middleware } from "@decorators/express";
import InvalidException from "exception/invalid.exception";
import { NextFunction, Request, Response } from "express";
import multer from "multer";

export default class UploadAvatarImageMiddleware implements Middleware {
  public async use(req: Request, res: Response, next: NextFunction) {
    try {
      const storage = multer.diskStorage({
        // 圖片上傳的位置
        destination: function (req, file, cb) {
          cb(null, "./uploads");
        },
        // 檔名
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      });

      const uploadImage = multer({
        storage,
        // 驗證檔案副檔名
        fileFilter: (req, file, cb) => {
          const mimeTypes = ["image/jpg", "image/png", "image/jpeg"];

          if (mimeTypes.includes(file.mimetype)) {
            return cb(null, true);
          } else {
            return cb(new InvalidException("圖片只能接受 jpg, jpeg, png"));
          }
        },
      }).single("avatar");

      await uploadImage(req, res, next);
    } catch (error) {
      console.log(error);
      return res.json({ error });
    }
  }
}
