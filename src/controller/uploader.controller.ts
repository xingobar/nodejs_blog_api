import { Controller, Post, Request, Response } from "@decorators/express";
import AWS from "aws-sdk";
import config from "config/index";
import fs from "fs";
import path from "path";
import UploadAvatarImageMiddleware from "middleware/upload.avatar.image.middleware";

@Controller("/uploader")
export default class UploaderController {
  @Post("/images", [UploadAvatarImageMiddleware])
  public image(@Request() req: any, @Response() res: any) {
    AWS.config.update({
      accessKeyId: config.aws.accessKey,
      secretAccessKey: config.aws.secretKey,
      region: config.aws.region,
    });

    var s3 = new AWS.S3();
    // var filePath = "./src/controller/file.txt";

    //configuring parameters
    var params = {
      Bucket: config.aws.bucket,
      Body: fs.createReadStream(req.file.path),
      Key: "dev/" + Date.now() + "_" + path.basename(req.file.path),
    };

    // ManagedUpload.SendData;
    s3.upload(params, (err: any, data: any) => {
      //handle error
      if (err) {
        console.log("Error", err);

        return res.json(err);
      }

      //success
      if (data) {
        console.log("Uploaded in:", data.Location);

        // 刪除圖片
        fs.unlinkSync(req.file.path);

        return res.json(data);
      }
    });
  }
}
