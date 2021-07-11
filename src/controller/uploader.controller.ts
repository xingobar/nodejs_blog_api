import { Controller, Post, Request, Response } from "@decorators/express";
import { Container } from "typedi";
import UploadAvatarImageMiddleware from "middleware/upload.avatar.image.middleware";
import AwsLib from "lib/aws.lib";
import fs from "fs";
import logger from "lib/logger.lib";
import InvalidException from "exception/invalid.exception";

@Controller("/uploader")
export default class UploaderController {
  // 圖片上傳
  @Post("/images", [UploadAvatarImageMiddleware])
  public image(@Request() req: any, @Response() res: any) {
    const awsLib: AwsLib = Container.get(AwsLib);

    awsLib.upload({
      filePath: req.file.path,
      callback: (err: any, data: any) => {
        //handle error
        if (err) {
          console.log("Error", err);

          logger.error(err);

          throw new InvalidException("上傳失敗");
        }

        //success
        if (data) {
          console.log("Uploaded in:", data.Location);

          // 刪除圖片
          fs.unlinkSync(req.file.path);

          return res.json(data);
        }
      },
    });
  }
}
